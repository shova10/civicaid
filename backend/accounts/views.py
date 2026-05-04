import random
from rest_framework import generics
from rest_framework.permissions import AllowAny
from .models import CustomUser, OTPVerification
from .serializers import RegisterSerializer, CivicAidTokenSerializer, UserProfileSerializer
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, BasePermission
from rest_framework_simplejwt.tokens import RefreshToken
from django.conf import settings
from django.core.mail import send_mail
from django.utils import timezone
from datetime import timedelta

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

        send_mail(
            subject="Your OTP Code",
            message=f"Your OTP is {otp}",
            from_email=settings.DEFAULT_FROM_EMAIL,
            recipient_list=[user.email],
        )
    
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

        OTPVerification.objects.create(
            user=user,
            otp=otp
        )

   
        send_mail(
            subject="Your New OTP Code",
            message=f"Your new OTP is {otp}",
            from_email=settings.DEFAULT_FROM_EMAIL,
            recipient_list=[user.email],
        )

        return Response(
            {"message": "OTP resent successfully"},
            status=200
        )

class IsAdmin(BasePermission):
    def has_permission(self, request, view):
        return request.user.role == 'admin'

class AdminUserListView(generics.ListAPIView):
    serializer_class = UserProfileSerializer
    permission_classes = [IsAuthenticated, IsAdmin]
    queryset = CustomUser.objects.all().order_by('-date_joined')