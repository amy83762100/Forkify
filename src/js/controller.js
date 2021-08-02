import * as model from './model';
import recipeView from './views/recipeView';
import searchView from './views/searchView';
import resultsView from './views/resultsView';
import paginationView from './views/paginationView';
import addRecipeView from './views/addRecipeView';
import { MODAL_CLOSE_SEC } from './config';
import 'core-js/stable';
import 'regenerator-runtime';
import bookmarksView from './views/bookmarksView';
import { async } from 'regenerator-runtime';

// https://forkify-api.herokuapp.com/v2
///////////////////////////////////////

const controlRecipes = async function (id) {
  try {
    // 0.1) Get id from url hash
    const id = window.location.hash.slice(1);
    if (!id) return;
    // 0.2) Spinner
    recipeView.renderSpinner();

    // 1) Loading recipe
    await model.loadRecipe(id);
    // 1.1) Update result
    resultsView.update(model.getSearchResultsPage(model.state.search.page));

    bookmarksView.update(model.state.bookmarks);
    // 2) Rendering recipe
    recipeView.render(model.state.recipe);
  } catch (err) {
    recipeView.renderError();
    console.error(err);
  }
};

const controlSearchResults = async function () {
  try {
    // 1) Get search query
    const query = searchView.getQuery();
    if (!query) return;
    resultsView.renderSpinner();
    // 2) Load search results
    await model.loadSearchResults(query);
    // 3) render results
    //resultsView.render(model.state.search.results);
    resultsView.render(model.getSearchResultsPage());
    // 4) Render initial pagination buttons
    paginationView.render(model.state.search);
  } catch (err) {
    resultsView.renderError();
    console.error(err);
  }
};
const controlPagination = function (page) {
  model.state.search.page = page;
  // 1) render new results
  resultsView.render(model.getSearchResultsPage(model.state.search.page));
  // 4) Render new pagination buttons
  paginationView.render(model.state.search);
};
const controlServings = function (newServings) {
  // Update the recipe serving (in state)
  model.updateServings(newServings);
  // Update the recipe view
  // recipeView.render(model.state.recipe);
  recipeView.update(model.state.recipe);
};
const controlAddBookmark = function () {
  // 1) Add/render bookmark
  if (!model.state.recipe.bookmarked) model.addBookmark(model.state.recipe);
  else model.deleteBookmark(model.state.recipe.id);
  // 2) Update recipe view
  recipeView.update(model.state.recipe);
  // 3) Render bookmarks
  bookmarksView.render(model.state.bookmarks);
};
const controlLoadBookmarks = function () {
  bookmarksView.render(model.state.bookmarks);
};
const controlAddRecipe = async function (newRecipe) {
  try {
    // Show loading spinner
    addRecipeView.renderSpinner();
    // Upload the new recipe data
    await model.uploadRecipe(newRecipe);
    // Render recipe
    recipeView.render(model.state.recipe);
    // Success message
    addRecipeView.renderMessage();
    //  Render bookmarks view
    bookmarksView.render(model.state.bookmarks);
    // Change ID in URL
    window.history.pushState(null, '', `#${model.state.recipe.id}`);

    // Close form window
    setTimeout(function () {
      addRecipeView.toggleWindow();
    }, MODAL_CLOSE_SEC * 1000);
  } catch (err) {
    addRecipeView.renderError(err.message);
  }
};

const init = function () {
  recipeView.addHandlerRender(controlRecipes);
  recipeView.addHandlerUpdateServing(controlServings);
  recipeView.addHandlerAddBookmark(controlAddBookmark);
  searchView.addHandlerSearch(controlSearchResults);
  paginationView.addHandlerClick(controlPagination);
  bookmarksView.addHandlerLoadBookmark(controlLoadBookmarks);
  addRecipeView.addHandlerUpload(controlAddRecipe);
};
init();
