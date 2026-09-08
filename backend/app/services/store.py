from datetime import date


def calculate_business_period(open_date: date) -> str:
    today = date.today()

    years = today.year - open_date.year
    months = today.month - open_date.month

    if today.day < open_date.day:
        months -= 1

    if months < 0:
        years -= 1
        months += 12

    if years == 0:
        return f"{months}개월"

    if months == 0:
        return f"{years}년"

    return f"{years}년 {months}개월"