from typing import Any


class ApiError(Exception):
    """팀 공통 envelope 에러 응답을 만들기 위한 예외.

    라우터/서비스에서 raise하면 main.py의 exception handler가
    {isSuccess: false, code, message, result: null, error} 형태로 변환한다.
    """

    def __init__(self, status_code: int, code: str, message: str):
        self.status_code = status_code
        self.code = code
        self.message = message
        super().__init__(message)


def success(code: str, message: str, result: Any) -> dict:
    return {
        "isSuccess": True,
        "code": code,
        "message": message,
        "result": result,
        "error": None,
    }


def error(code: str, message: str) -> dict:
    return {
        "isSuccess": False,
        "code": code,
        "message": message,
        "result": None,
        "error": {"code": code, "message": message},
    }
