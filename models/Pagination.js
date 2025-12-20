/**
 * @typedef Pagination
 * @property {number} totalItemsCount
 * @property {number} pageSize
 * @property {number} pagesCount
 * @property {number} currentPage
 */

/**
 * @typedef PaginationOptions
 * @property {number} pageSize
 * @property {number} currentPage
 */

/**
 * @template T
 * @typedef PaginatedList
 * @property {T[]} items
 * @property {Pagination} pagination
 */