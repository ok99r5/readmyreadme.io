/**
 * 텍스트 컨텐츠 페이징 모듈
 * 185자 이상인 경우 문단 단위로 페이징
 */
(function() {
  const MIN_CHARS = 185;

  document.addEventListener('DOMContentLoaded', function() {
    const content = document.getElementById('paged-content');
    if (!content) return;

    // 문단 요소들 가져오기 (제목 제외)
    const paragraphs = Array.from(content.querySelectorAll('p, ul, ol, blockquote, pre'));
    if (paragraphs.length === 0) return;

    // 전체 텍스트 길이 계산
    const totalText = paragraphs.map(p => p.textContent).join('');
    if (totalText.length < MIN_CHARS) return;

    // 페이지 나누기 (문단 단위, 각 페이지 185자 내외)
    const pages = [];
    let currentPage = [];
    let currentLength = 0;

    paragraphs.forEach(p => {
      const pLength = p.textContent.length;

      if (currentLength + pLength > MIN_CHARS && currentPage.length > 0) {
        pages.push(currentPage);
        currentPage = [p];
        currentLength = pLength;
      } else {
        currentPage.push(p);
        currentLength += pLength;
      }
    });

    if (currentPage.length > 0) {
      pages.push(currentPage);
    }

    // 페이지가 1개면 페이징 불필요
    if (pages.length <= 1) return;

    // 모든 문단 숨기기
    paragraphs.forEach(p => p.style.display = 'none');

    // 페이징 UI 생성
    let currentPageIndex = 0;

    const navContainer = document.createElement('nav');
    navContainer.className = 'paging-nav';
    navContainer.style.cssText = 'display: flex; justify-content: center; align-items: center; gap: 1rem; margin-top: 2rem; padding-top: 1rem; border-top: 1px solid #eee;';

    const prevBtn = document.createElement('button');
    prevBtn.textContent = '← 이전';
    prevBtn.style.cssText = 'padding: 0.5rem 1rem; cursor: pointer; border: 1px solid #ccc; background: #fff; border-radius: 4px;';

    const pageInfo = document.createElement('span');
    pageInfo.style.cssText = 'min-width: 60px; text-align: center;';

    const nextBtn = document.createElement('button');
    nextBtn.textContent = '다음 →';
    nextBtn.style.cssText = 'padding: 0.5rem 1rem; cursor: pointer; border: 1px solid #ccc; background: #fff; border-radius: 4px;';

    navContainer.appendChild(prevBtn);
    navContainer.appendChild(pageInfo);
    navContainer.appendChild(nextBtn);
    content.appendChild(navContainer);

    function showPage(index) {
      // 모든 문단 숨기기
      paragraphs.forEach(p => p.style.display = 'none');

      // 현재 페이지 문단만 표시
      pages[index].forEach(p => p.style.display = '');

      // 페이지 정보 업데이트
      pageInfo.textContent = (index + 1) + ' / ' + pages.length;

      // 버튼 상태 업데이트
      prevBtn.disabled = index === 0;
      nextBtn.disabled = index === pages.length - 1;
      prevBtn.style.opacity = index === 0 ? '0.5' : '1';
      nextBtn.style.opacity = index === pages.length - 1 ? '0.5' : '1';
    }

    prevBtn.addEventListener('click', function() {
      if (currentPageIndex > 0) {
        currentPageIndex--;
        showPage(currentPageIndex);
      }
    });

    nextBtn.addEventListener('click', function() {
      if (currentPageIndex < pages.length - 1) {
        currentPageIndex++;
        showPage(currentPageIndex);
      }
    });

    // 첫 페이지 표시
    showPage(0);
  });
})();
