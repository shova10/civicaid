from rest_framework import serializers
from .models import CustomUser
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from django.db.models import Count
from django.contrib.auth import get_user_model

User = get_user_model()

class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)
    password2 = serializers.CharField(write_only=True)

    class Meta:
        model = CustomUser
        fields = ['username', 'full_name', 'email', 'password', 'password2', 'phone', 'address', 'date_of_birth']

    def validate_full_name(self, value):
        if len(value.strip().split()) < 2:
            raise serializers.ValidationError("Please enter your full name (first and last name).")
        return value.strip()

    def validate(self, attrs):
        if attrs['password'] != attrs['password2']:
            raise serializers.ValidationError("Password do not match")
        return attrs

    def create(self, validated_data):
        validated_data.pop('password2')
        password = validated_data.pop('password')
        validated_data['role'] = CustomUser.Role.CITIZEN
        user = CustomUser(**validated_data)
        user.set_password(password)
        user.save()
        return user

class CivicAidTokenSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)
        token['role'] = user.role
        token['full_name'] = user.full_name
        token['language'] = user.language
        return token

    def validate(self, attrs):
        data = super().validate(attrs)
        data['user'] = {
            "id": self.user.id,
            "full_name": self.user.full_name,
            "email": self.user.email,
            "role": self.user.role,
            "language": self.user.language,
        }
        return data

class UserProfileSerializer(serializers.ModelSerializer):
    complaint_count = serializers.SerializerMethodField()

    def get_complaint_count(self, obj):
        return obj.complaint_set.count()

    class Meta:
        model = CustomUser
        fields = ['id', 'username', 'email', 'full_name', 'phone', 'address', 'date_of_birth', 'language', 'role', 'created_at', 'is_active', 'date_joined', 'complaint_count',]
        read_only_fields = ['id', 'email', 'role', 'created_at']




class ForgotPasswordSerializer(serializers.Serializer):
    email = serializers.EmailField()

class ChangePasswordSerializer(serializers.Serializer):
    old_password = serializers.CharField()
    new_password = serializers.CharField()
    confirm_password = serializers.CharField()

    def validate(self, data):
        if data['new_password'] != data['confirm_password']:
            raise serializers.ValidationError({"error": "New passwords do not match."})
        return data

class ResetPasswordSerializer(serializers.Serializer):
    uid = serializers.CharField()
    token = serializers.CharField()
    new_password = serializers.CharField()
    confirm_password = serializers.CharField()

    def validate(self, data):
        if data['new_password'] != data['confirm_password']:
            raise serializers.ValidationError({"error": "Passwords do not match."})
        return data