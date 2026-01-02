#!/usr/bin/env python3
"""
_drafts/{category}/*.txt 파일을 _works/{year}/{category}/*.md 파일로 변환

사용법:
  python3 convert.py changed_files.txt  # 파일 목록에 있는 것만 변환

카테고리: text, lesson, principle, tenet
- 첫 줄: 제목
- 나머지: 본문
- 모든 특수문자 안전하게 처리
"""

import os
import sys
from datetime import datetime

# 지원하는 카테고리 목록
CATEGORIES = ['text', 'lesson', 'principle', 'tenet']


def get_category_from_path(txt_path: str) -> str | None:
    """파일 경로에서 카테고리 추출"""
    # _drafts/{category}/filename.txt 형식
    parts = txt_path.split('/')
    if len(parts) >= 3 and parts[0] == '_drafts':
        category = parts[1]
        if category in CATEGORIES:
            return category
    return None


def convert_txt_to_md(txt_path: str, category: str) -> str | None:
    """txt 파일을 md 파일로 변환하고, 생성된 md 파일 경로를 반환"""

    # 파일 존재 확인
    if not os.path.exists(txt_path):
        print(f"Skip (not found): {txt_path}")
        return None

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

    # 출력 경로: _works/{year}/{category}/
    filename = os.path.splitext(os.path.basename(txt_path))[0]
    output_dir = f"_works/{year}/{category}"
    os.makedirs(output_dir, exist_ok=True)
    output_path = f"{output_dir}/{filename}.md"

    # 파일 쓰기
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

    with open(output_path, 'w', encoding='utf-8') as f:
        f.write(md_content)

    return output_path


def main():
    if len(sys.argv) < 2:
        print("Error: 파일 목록이 필요합니다")
        print("Usage: python3 convert.py changed_files.txt")
        sys.exit(1)

    file_list_path = sys.argv[1]

    if not os.path.exists(file_list_path):
        print(f"File list not found: {file_list_path}")
        return

    with open(file_list_path, 'r') as f:
        txt_files = [line.strip() for line in f if line.strip()]

    if not txt_files:
        print("No changed txt files to convert")
        return

    converted_count = 0
    for txt_file in txt_files:
        category = get_category_from_path(txt_file)
        if category:
            result = convert_txt_to_md(txt_file, category)
            if result:
                print(f"Converted: {txt_file} -> {result}")
                converted_count += 1
        else:
            print(f"Skip (invalid path): {txt_file}")

    if converted_count == 0:
        print("No files converted")
    else:
        print(f"\nTotal converted: {converted_count} file(s)")


if __name__ == '__main__':
    main()
