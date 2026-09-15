import uuid

import boto3

from app.core.config import settings

_client = None


def get_s3_client():
    global _client
    if _client is None:
        _client = boto3.client(
            "s3",
            region_name=settings.AWS_REGION,
            aws_access_key_id=settings.AWS_ACCESS_KEY_ID,
            aws_secret_access_key=settings.AWS_SECRET_ACCESS_KEY,
        )
    return _client


def upload_file(file_bytes: bytes, key: str, content_type: str) -> str:
    """S3에 파일을 업로드하고 객체 키를 반환한다."""
    get_s3_client().put_object(
        Bucket=settings.AWS_S3_BUCKET,
        Key=key,
        Body=file_bytes,
        ContentType=content_type,
    )
    return key


def build_document_key(user_id: int, slot: str, filename: str) -> str:
    ext = filename.rsplit(".", 1)[-1] if "." in filename else "bin"
    return f"finance-applications/{user_id}/{slot}-{uuid.uuid4().hex}.{ext}"
