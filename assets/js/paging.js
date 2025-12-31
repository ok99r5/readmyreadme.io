/**
 * 텍스트 컨텐츠 페이징 모듈
 * 800자 기준으로 페이징 (글자 수 기반)
 */
(function() {
  const PAGE_SIZE = 800;

  document.addEventListener('DOMContentLoaded', function() {
    const content = document.getElementById('paged-content');
    if (!content) return;

    // 제목(h1, h2 등) 분리
    const headings = content.querySelectorAll('h1, h2, h3, h4, h5, h6');
    const headingHTML = Array.from(headings).map(h => h.outerHTML).join('');

    // 제목 제거 후 본문 텍스트만 추출
    headings.forEach(h => h.remove());
    const fullText = content.innerText.trim();

    // 800자 미만이면 페이징 불필요
    if (fullText.length < PAGE_SIZE) {
      // 제목 복원
      content.innerHTML = headingHTML + content.innerHTML;
      return;
    }

    // 글자 수 기준으로 페이지 나누기 (단어 단위)
    const pages = [];
    let remaining = fullText;

    while (remaining.length > 0) {
      if (remaining.length <= PAGE_SIZE) {
        pages.push(remaining);
        break;
      }

      // 800자 지점에서 가장 가까운 공백/마침표 찾기
      let cutPoint = PAGE_SIZE;

      // 뒤로 가면서 공백이나 마침표 찾기
      while (cutPoint > 0 && !/[\s.。!?]/.test(remaining[cutPoint])) {
        cutPoint--;
      }

      // 못 찾으면 그냥 800자에서 자름
      if (cutPoint === 0) {
        cutPoint = PAGE_SIZE;
      }

      pages.push(remaining.substring(0, cutPoint + 1).trim());
      remaining = remaining.substring(cutPoint + 1).trim();
    }

    // 페이지가 1개면 페이징 불필요
    if (pages.length <= 1) {
      content.innerHTML = headingHTML + content.innerHTML;
      return;
    }

    // 페이징 UI 생성
    let currentPageIndex = 0;

    // 콘텐츠 영역 재구성
    const titleDiv = document.createElement('div');
    titleDiv.innerHTML = headingHTML;

    const textDiv = document.createElement('div');
    textDiv.id = 'paged-text';
    textDiv.style.cssText = 'white-space: pre-wrap; line-height: 1.8;';

    const navContainer = document.createElement('nav');
    navContainer.className = 'paging-nav';
    navContainer.style.cssText = 'display: flex; justify-content: center; align-items: center; gap: 1rem; margin-top: 0.5rem; margin-bottom: 3rem;';

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

    content.innerHTML = '';
    content.appendChild(titleDiv);
    content.appendChild(textDiv);
    content.appendChild(navContainer);

    function showPage(index) {
      textDiv.textContent = pages[index];
      pageInfo.textContent = (index + 1) + ' / ' + pages.length;

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
