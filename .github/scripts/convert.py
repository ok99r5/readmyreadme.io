#!/usr/bin/env python3
"""
_drafts/{category}/*.txt 파일을 _writings/{year}/{category}/*.md 파일로 변환

카테고리: text, lesson, principle, tenet
- 첫 줄: 제목
- 나머지: 본문
- 모든 특수문자 안전하게 처리
"""

import os
import glob
from datetime import datetime

# 지원하는 카테고리 목록
CATEGORIES = ['text', 'lesson', 'principle', 'tenet']


def convert_txt_to_md(txt_path: str, category: str) -> str | None:
    """txt 파일을 md 파일로 변환하고, 생성된 md 파일 경로를 반환"""

    # 파일 읽기 (UTF-8)
    try:
        with open(txt_path, 'r', encoding='utf-8') as f:
            content = f.read()
    except UnicodeDecodeError:
        # UTF-8 실패 시 cp949 시도 (한글 윈도우)
        with open(txt_path, 'r', encoding='cp949') as f:
            content = f.read()

    # 빈 파일 체크
    if not content.strip():
        print(f"Skip (empty): {txt_path}")
        return None

    # 첫 줄 = 제목, 나머지 = 본문
    lines = content.split('\n')
    title = lines[0].strip()
    body = '\n'.join(lines[1:]).strip()

    # 제목이 비어있으면 파일명 사용
    if not title:
        title = os.path.splitext(os.path.basename(txt_path))[0]

    # 제목에서 YAML 문제가 될 수 있는 문자 처리
    safe_title = title.replace('\\', '\\\\').replace('"', '\\"')

    # 날짜 정보
    today = datetime.now().strftime('%Y-%m-%d')
    year = datetime.now().strftime('%Y')

    # 출력 경로: _writings/{year}/{category}/
    filename = os.path.splitext(os.path.basename(txt_path))[0]
    output_dir = f"_writings/{year}/{category}"
    os.makedirs(output_dir, exist_ok=True)
    output_path = f"{output_dir}/{filename}.md"

    # Front matter + 본문 생성
    md_content = f'''---
layout: post
title: "{safe_title}"
author: a-small-fish
date: {today}
category: {category}
license: CC BY-NC-SA 4.0
---

## {title}

{body}
'''

    # 파일 쓰기
    with open(output_path, 'w', encoding='utf-8') as f:
        f.write(md_content)

    # 원본 삭제
    os.remove(txt_path)

    return output_path


def main():
    converted_count = 0

    for category in CATEGORIES:
        # _drafts/{category}/*.txt 파일 찾기
        pattern = f'_drafts/{category}/*.txt'
        txt_files = glob.glob(pattern)

        for txt_file in txt_files:
            result = convert_txt_to_md(txt_file, category)
            if result:
                print(f"Converted: {txt_file} -> {result}")
                converted_count += 1

    if converted_count == 0:
        print("No .txt files found in _drafts/{category}/ folders")
    else:
        print(f"\nTotal converted: {converted_count} file(s)")


if __name__ == '__main__':
    main()
