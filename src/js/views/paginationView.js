import View from './view';
import icons from 'url:../../img/icons.svg';

class PaginationView extends View {
  _parentElement = document.querySelector('.pagination');
  addHandlerClick(handler) {
    this._parentElement.addEventListener('click', function (event) {
      const btn = event.target.closest('.btn--inline');
      if (!btn) return;
      const goToPage = btn.dataset.goto;
      handler(goToPage);
    });
  }
  _generateMarkup() {
    const numOfResults = this._data.results.length;
    const numOfPages = Math.ceil(numOfResults / this._data.resultsPerPage);
    const page = +this._data.page;
    let markup = '';
    const prevPageBtn = `
    <button data-goto="${page - 1}" class="btn--inline pagination__btn--prev">
        <svg class="search__icon">
        <use href="${icons}#icon-arrow-left"></use>
        </svg>
        <span>Page ${page - 1}</span>
    </button>
    `;
    const nextPageBtn = `
    <button data-goto="${page + 1}" class="btn--inline pagination__btn--next">
        <span>Page ${page + 1}</span>
        <svg class="search__icon">
        <use href="${icons}#icon-arrow-right"></use>
        </svg>
    </button>`;
    // Page 1, and there are other page
    if (page === 1 && numOfPages > 1) markup = nextPageBtn;
    // Last page
    if (numOfPages === page && numOfPages > 1) markup = prevPageBtn;
    // Other page
    if (page !== 1 && page < numOfPages)
      markup = `${prevPageBtn} ${nextPageBtn}`;
    // Page 1, and there are NO other page
    //if (numOfPages === 1) markup = '';
    return markup;
  }
}
export default new PaginationView();
