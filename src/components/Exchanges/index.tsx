import React from "react";
import { Grid } from "@material-ui/core";
import { useHistory } from "react-router-dom";
import useAxios from "axios-hooks";
import numeral from "numeral";
import { constantCase } from "change-case";
import CoinChart from "containers/CoinChart";
import { theme } from "styles";
import { Exchangess } from "./interfaces";
import { SC } from "./styled";
import { Pagination, Skeleton } from "@material-ui/lab";
import { useQueryParams, NumberParam } from "use-query-params";

const CHART_BOX_SIZE = {
  height: 40,
  width: 150,
};

const INITIAL_QUERY_PARAMS = {
  per_page: 20,
  page: 1,
};

const MAX_PAGE_COUNT = 250;

const Exchanges = () => {
  const history = useHistory();
  const [queryParams, setQueryParams] = useQueryParams({
    per_page: NumberParam,
    page: NumberParam,
  });

  const [{ data, loading }, refecth] = useAxios<Exchangess[]>(
    `https://api.coingecko.com/api/v3/exchanges?per_page=${
      queryParams?.per_page || INITIAL_QUERY_PARAMS.per_page
    }&page=${
      queryParams?.page || INITIAL_QUERY_PARAMS.page
    }
    `
  );

  React.useEffect(() => {
    setQueryParams({
      per_page: queryParams?.per_page || INITIAL_QUERY_PARAMS.per_page,
       page: queryParams?.page || INITIAL_QUERY_PARAMS.page,
    });
  }, [queryParams?.page, queryParams?.per_page, setQueryParams]);

  const TableHeader = () => {
    return (
      <thead>
        <SC.TableHeaderRow>
          <th align="left">Name</th>
          <th align="left">Exchange</th>
          <th align="left">trade_volume_24h_btc</th>
          <th align="left">trade_volume_24h_btc_normalized</th>
          <th align="left">7d %</th>
          <th align="left">24h Volume</th>
          <th align="left">Mkt Cap</th>
          <th align="left">Last 7 days</th>
        </SC.TableHeaderRow>
      </thead>
    );
  };

  const TableBody = () => {
    return (
      <tbody>
        {data?.length
          ? data.map((ele) => {
              return (
                <SC.TableBodyRow key={ele.id}>
                  <SC.TableData>{ele.name}</SC.TableData>
                  <SC.TableData>
                    <div>
                      <img
                        height="20rem"
                        width="20rem"
                        src={ele.image}
                        alt={ele.name}
                      />
                    </div>

                    <div style={{ color: theme.colors.primary }}>

                    </div>
                  </SC.TableData>
                  <SC.TableData>
                    {numeral(ele.trade_volume_24h_btc).format("$0,0.00")}
                  </SC.TableData>


                  <SC.TableData>
                    {numeral(ele.trade_volume_24h_btc_normalized).format("$0,0")}
                  </SC.TableData>

                  <SC.TableData>
                    {numeral(ele.trust_score).format("$0,0")}
                  </SC.TableData>
                </SC.TableBodyRow>
              );
            })
          : null}
      </tbody>
    );
  };

  return (
    <SC.CoinsContainer>
      <Grid container justify="center">
        <Grid item style={{ overflowX: "auto" }} xs={12} md={10}>
          {loading ? (
            <Skeleton variant="rect" height="100vh" width="100%" />
          ) : (
            <>
              <SC.Table width="100%">
                <TableHeader />
                <TableBody />
              </SC.Table>
              <SC.PaginationWrapper>
                <Pagination
                  size="small"
                  count={MAX_PAGE_COUNT}
                  page={queryParams?.page || 1}
                  onChange={(e, pageNumber) => {
                    setQueryParams({
                      page: pageNumber,
                    });
                    refecth();
                  }}
                />
              </SC.PaginationWrapper>
            </>
          )}
        </Grid>
      </Grid>
    </SC.CoinsContainer>
  );
};

export default Exchanges;
