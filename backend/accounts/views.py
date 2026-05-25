import random
import os
import sib_api_v3_sdk
from sib_api_v3_sdk.rest import ApiException
from rest_framework import generics
from rest_framework.permissions import AllowAny
from .models import CustomUser, OTPVerification
from .serializers import RegisterSerializer, CivicAidTokenSerializer, UserProfileSerializer, ForgotPasswordSerializer, ChangePasswordSerializer
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework_simplejwt.tokens import RefreshToken
from django.conf import settings
from django.utils import timezone
from datetime import timedelta
from rest_framework import status
from django.contrib.auth.tokens import PasswordResetTokenGenerator
from django.utils.http import urlsafe_base64_encode
from django.utils.encoding import force_bytes
from django.core.mail import send_mail
from django.contrib.auth import get_user_model

User = get_user_model()


def send_otp_email(to_email, otp, subject="Your OTP Code", message=None):
    try:
        configuration = sib_api_v3_sdk.Configuration()
        configuration.api_key['api-key'] = os.getenv('BREVO_API_KEY')

        api_instance = sib_api_v3_sdk.TransactionalEmailsApi(
            sib_api_v3_sdk.ApiClient(configuration)
        )

        email = sib_api_v3_sdk.SendSmtpEmail(
            to=[{"email": to_email}],
            sender={"email": os.getenv('DEFAULT_FROM_EMAIL'), "name": "CivicAid"},
            subject=subject,
            text_content=message or f"Your OTP is {otp}"
        )
        api_instance.send_transac_email(email)
        print(f"Email sent successfully to {to_email}")
    except ApiException as e:
        print(f"Email sending failed: {e}")


class RegisterView(generics.CreateAPIView):
    queryset = CustomUser.objects.all()
    serializer_class = RegisterSerializer
    permission_classes = [AllowAny]

    def perform_create(self, serializer):
        user = serializer.save(is_active=False)
        otp = str(random.randint(100000, 999999))

        OTPVerification.objects.create(
            user=user,
            otp=otp
        )

        send_otp_email(user.email, otp)


class LoginView(TokenObtainPairView):
    serializer_class = CivicAidTokenSerializer
    permission_classes = [AllowAny]


class LogoutView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        refresh_token = request.data['refresh']
        RefreshToken(refresh_token).blacklist()
        return Response({'message': 'Logged out successfully'})


class ProfileView(generics.RetrieveUpdateAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = UserProfileSerializer

    def get_object(self):
        return self.request.user


class VerifyOTPView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        email = request.data.get('email')
        otp_input = request.data.get('otp')

        if not email or not otp_input:
            return Response(
                {"error": "email and otp are required"},
                status=400
            )

        try:
            user = CustomUser.objects.get(email=email)
        except CustomUser.DoesNotExist:
            return Response(
                {"error": "User not found"},
                status=404
            )

        try:
            otp_obj = OTPVerification.objects.get(user=user)
        except OTPVerification.DoesNotExist:
            return Response(
                {"error": "OTP not found"},
                status=400
            )

        if otp_obj.created_at < timezone.now() - timedelta(minutes=5):
            otp_obj.delete()
            return Response(
                {"error": "OTP expired"},
                status=400
            )

        if otp_obj.otp != otp_input:
            return Response(
                {"error": "Invalid OTP"},
                status=400
            )

        user.is_active = True
        user.save()
        otp_obj.delete()

        return Response(
            {"message": "Account verified successfully"},
            status=200
        )


class ResendOTPView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        email = request.data.get('email')

        if not email:
            return Response(
                {"error": "email is required"},
                status=400
            )

        try:
            user = CustomUser.objects.get(email=email)
        except CustomUser.DoesNotExist:
            return Response(
                {"error": "User not found"},
                status=404
            )

        if user.is_active:
            return Response(
                {"message": "User already verified"},
                status=200
            )

        OTPVerification.objects.filter(user=user).delete()
        otp = str(random.randint(100000, 999999))
        OTPVerification.objects.create(user=user, otp=otp)

        send_otp_email(
            user.email,
            otp,
            subject="Your New OTP Code",
            message=f"Your new OTP is {otp}"
        )

        return Response(
            {"message": "OTP resent successfully"},
            status=200
        )


class ForgotPasswordView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = ForgotPasswordSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        email = serializer.validated_data['email']

        try:
            user = User.objects.get(email=email)
            token_generator = PasswordResetTokenGenerator()
            token = token_generator.make_token(user)
            uid = urlsafe_base64_encode(force_bytes(user.pk))
            reset_link = f"https://civicaid-sooty.vercel.app/reset-password/?uid={uid}&token={token}"

            send_mail(
                subject="CivicAid Password Reset",
                message=f"Click the link to reset your password: {reset_link}",
                from_email=settings.DEFAULT_FROM_EMAIL,
                recipient_list=[email],
                fail_silently=True,
            )
        except User.DoesNotExist:
            pass

        return Response(
            {"message": "If this email is registered, a reset link has been sent."},
            status=status.HTTP_200_OK
        )


class ChangePasswordView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        serializer = ChangePasswordSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        user = request.user
        old_password = serializer.validated_data['old_password']
        new_password = serializer.validated_data['new_password']

        if not user.check_password(old_password):
            return Response(
                {"error": "Old password is incorrect."},
                status=status.HTTP_400_BAD_REQUEST
            )

        user.set_password(new_password)
        user.save()

        return Response(
            {"message": "Password changed successfully."},
            status=status.HTTP_200_OK
        )