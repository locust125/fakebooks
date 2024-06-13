import { createContext, useReducer, useEffect, useCallback, use } from 'react';
import authService from 'src/services/auth-service';

export const CatalogsContext = createContext();

// Actions
const Actions = {
  SET_CATALOG_DATA: 'SET_CATALOG_DATA',
  SET_CATALOG_ERROR: 'SET_CATALOG_ERROR',
  SET_CATALOG_FILTERED_DATA: 'SET_CATALOG_FILTERED_DATA',
  SET_CATALOG_LOADING: 'SET_CATALOG_LOADING',
};

// Reducer to  manage the state
const catalogsReducer = (state, action) => {
  switch (action.type) {
    case Actions.SET_CATALOG_DATA:
      return {
        ...state,
        [action.payload.catalog]: {
          data: action.payload.data,
          error: {},
          filteredData: state[action.payload.catalog]?.filteredData || [],
        },
      };
    case Actions.SET_CATALOG_ERROR:
      return {
        ...state,
        [action.payload.catalog]: {
          ...state[action.payload.catalog],
          error: action.payload.error,
        },
      };
    case Actions.SET_CATALOG_FILTERED_DATA:
      return {
        ...state,
        [action.payload.catalog]: {
          ...state[action.payload.catalog],
          filteredData: action.payload.data,
        },
      };
    case Actions.SET_CATALOG_LOADING:
      return {
        ...state,
        [action.payload.catalog]: {
          ...state[action.payload.catalog],
          loading: action.payload.loading,
        },
      };
    default:
      return state;
  }
};

const CATALOGS_LIST = [
  'salesStats',
  // 'users',
  // 'location',
  // 'products',
  // 'terminalpos',
  // 'currency',
  // 'paymethod',
  // 'tax',
  // 'productCategory',
  // 'brand',
  // 'store',
  // 'warehouse',
  // 'mpuserGroup',
  // 'discount',
  // 'postVenta',

  'posts',//este
];

// Initial state
const initialState = {
  salesStats: { data: [], error: {}, filteredData: [], loading: false },
  // users: { data: [], error: {}, filteredData: [], loading: false },
  // location: { data: [], error: {}, filteredData: [], loading: false },
  // products: { data: [], error: {}, filteredData: [], loading: false },
  // terminalpos: { data: [], error: {}, filteredData: [], loading: false },
  // currency: { data: [], error: {}, filteredData: [], loading: false },
  // paymethod: { data: [], error: {}, filteredData: [], loading: false },
  // tax: { data: [], error: {}, filteredData: [], loading: false },
  // productCategory: { data: [], error: {}, filteredData: [], loading: false },
  // brand: { data: [], error: {}, filteredData: [], loading: false },
  // store: { data: [], error: {}, filteredData: [], loading: false },
  // warehouse: { data: [], error: {}, filteredData: [], loading: false },
  // mpuserGroup: { data: [], error: {}, filteredData: [], loading: false },
  // discount: { data: [], error: {}, filteredData: [], loading: false },

  posts: { data: [], error: {}, filteredData: [], loading: false },//este
};

// ContextProvider
export const CatalogsProvider = ({ children }) => {
  const [state, dispatch] = useReducer(catalogsReducer, initialState);

  // Funcition to fetch data
  const getData = useCallback(async ({ endpoint = '', catalog = '' }) => {
    try {
      if (typeof catalog !== 'string' || !CATALOGS_LIST.includes(catalog)) {
        throw new Error(`Invalid catalog: ${catalog}`);
      }

      if (typeof endpoint !== 'string') {
        throw new Error('Endpoint must be a string');
      }

      dispatch({
        type: Actions.SET_CATALOG_LOADING,
        payload: { catalog, loading: true },
      });

      const data = await authService.getData(endpoint);

      dispatch({ type: Actions.SET_CATALOG_DATA, payload: { catalog, data } });
      dispatch({
        type: Actions.SET_CATALOG_FILTERED_DATA,
        payload: { catalog, data },
      });
    } catch (err) {
      dispatch({
        type: Actions.SET_CATALOG_ERROR,
        payload: { catalog, error: { code: 401, error: err } },
      });
      console.log(err);
    } finally {
      dispatch({
        type: Actions.SET_CATALOG_LOADING,
        payload: { catalog, loading: false },
      });
    }
  }, []);

  const getSalesSats = useCallback(
    () => getData({ endpoint: 'dashboard/sales/stats', catalog: 'salesStats' }),
    [getData],
  );

  const getUsers = useCallback(
    () => getData({ endpoint: 'mpuser', catalog: 'users' }),
    [getData],
  );

  const getLocations = useCallback(
    () => getData({ endpoint: 'location', catalog: 'location' }),
    [getData],
  );

  const getProducts = useCallback(
    () => getData({ endpoint: 'product', catalog: 'products' }),
    [getData],
  );

  // const getTerminalpos = useCallback(
  //   () => getData({ endpoint: 'terminalpos', catalog: 'terminalpos' }),
  //   [getData],
  // );

  // const getCurrency = useCallback(
  //   () => getData({ endpoint: 'currency', catalog: 'currency' }),
  //   [getData],
  // );

  // const getPaymethod = useCallback(
  //   () => getData({ endpoint: 'paymethod', catalog: 'paymethod' }),
  //   [getData],
  // );

  // const getTax = useCallback(
  //   () => getData({ endpoint: 'tax', catalog: 'tax' }),
  //   [getData],
  // );

  // const getProductCategory = useCallback(
  //   () => getData({ endpoint: 'productcategory', catalog: 'productCategory' }),
  //   [getData],
  // );

  // const getBrand = useCallback(
  //   () => getData({ endpoint: 'brand', catalog: 'brand' }),
  //   [getData],
  // );

  // const getStore = useCallback(
  //   () => getData({ endpoint: 'store', catalog: 'store' }),
  //   [getData],
  // );

  // const getWarehouse = useCallback(
  //   () => getData({ endpoint: 'warehouse', catalog: 'warehouse' }),
  //   [getData],
  // );

  // const getMpusersGroup = useCallback(
  //   () => getData({ endpoint: 'mpusergroup', catalog: 'mpuserGroup' }),
  //   [getData],
  // );

  // const getDiscount = useCallback(
  //   () => getData({ endpoint: 'discount', catalog: 'discount' }),
  //   [getData],
  // );

  // const getPostVenta = useCallback(
  //   () => getData({ endpoint: 'photosamplemail', catalog: 'postVenta' }),
  //   [getData],
  // );

  //este

  const getPosts = useCallback(
    () => getData({ endpoint: 'getAll/post', catalog: 'posts' }),
    [getData],
  );

  useEffect(() => {
    // Users data fetch
    // getSalesSats();
    // getUsers();
    // getLocations();
    // getProducts();
    // getTerminalpos();
    // getCurrency();
    // getPaymethod();
    // getTax();
    // getProductCategory();
    // getBrand();
    // getStore();
    // getWarehouse();
    // getMpusersGroup();
    // getDiscount();
    // getPostVenta();

    getPosts();//este

  }, [
    getSalesSats,
    // getUsers,
    // getLocations,
    // getProducts,
    // getTerminalpos,
    // getCurrency,
    // getPaymethod,
    // getTax,
    // getProductCategory,
    // getBrand,
    // getStore,
    // getWarehouse,
    // getMpusersGroup,
    // getDiscount,
    // getPostVenta,

    getPosts,//este
  ]);

  return (
    <CatalogsContext.Provider
      value={{
        state,
        getSalesSats,
        getUsers,
        getLocations,
        getProducts,
        // getTerminalpos,
        // getCurrency,
        // getPaymethod,
        // getTax,
        // getProductCategory,
        // getBrand,
        // getStore,
        // getWarehouse,
        // getMpusersGroup,
        // getDiscount,
        // getPostVenta,

        getPosts,//este

      }}
    >
      {children}
    </CatalogsContext.Provider>
  );
};
