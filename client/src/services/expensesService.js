import http from "./httpService";
import { apiUrl } from "../config.json";

const apiEndpoint = apiUrl + "/expenses";

export function getExpenses(firstDay, lastDay, userId) {
  let url =
    apiEndpoint +
    "/allexpenses" +
    "/" +
    firstDay +
    "/" +
    lastDay +
    "/" +
    userId;
  return http.get(url);
}

export function addExpenses(expense) {
  let url = apiEndpoint + "/add-expense";
  return http.post(url, expense);
}

export function updateExpense(expense) {
  const body = { ...expense };
  delete body._id;
  return http.put(apiEndpoint + "/" + expense._id, body);
}

export function removeExpense(expenseId) {
  return http.delete(apiEndpoint + "/" + expenseId);
}

export function currentMonthPreview(userId) {
  return http.get(apiEndpoint + "/current/preview/" + userId);
}

export function expenseByCategory(userId) {
  return http.get(apiEndpoint + "/by/category/" + userId);
}

export function plotExpenses(month, userId) {
  return http.get(apiEndpoint + "/plot-expenses/" + month + "/" + userId);
}

export function yearlyExpenses(year, userId) {
  return http.get(apiEndpoint + "/yearly-expenses/" + year + "/" + userId);
}

export function plotByCategory(firstDay, lastDay, userId) {
  return http.get(
    apiEndpoint +
      "/category-expenses/" +
      firstDay +
      "/" +
      lastDay +
      "/" +
      userId
  );
}
