import type * as types from './types';
import type { ConfigOptions, FetchResponse } from 'api/dist/core'
import Oas from 'oas';
import APICore from 'api/dist/core';
import definition from './openapi.json';

class SDK {
  spec: Oas;
  core: APICore;

  constructor() {
    this.spec = Oas.init(definition);
    this.core = new APICore(this.spec, 'etomin/2.0.1 (api/6.1.3)');
  }

  /**
   * Optionally configure various options that the SDK allows.
   *
   * @param config Object of supported SDK options and toggles.
   * @param config.timeout Override the default `fetch` request timeout of 30 seconds. This number
   * should be represented in milliseconds.
   */
  config(config: ConfigOptions) {
    this.core.setConfig(config);
  }

  /**
   * If the API you're using requires authentication you can supply the required credentials
   * through this method and the library will magically determine how they should be used
   * within your API request.
   *
   * With the exception of OpenID and MutualTLS, it supports all forms of authentication
   * supported by the OpenAPI specification.
   *
   * @example <caption>HTTP Basic auth</caption>
   * sdk.auth('username', 'password');
   *
   * @example <caption>Bearer tokens (HTTP or OAuth 2)</caption>
   * sdk.auth('myBearerToken');
   *
   * @example <caption>API Keys</caption>
   * sdk.auth('myApiKey');
   *
   * @see {@link https://spec.openapis.org/oas/v3.0.3#fixed-fields-22}
   * @see {@link https://spec.openapis.org/oas/v3.1.0#fixed-fields-22}
   * @param values Your auth credentials for the API; can specify up to two strings or numbers.
   */
  auth(...values: string[] | number[]) {
    this.core.setAuth(...values);
    return this;
  }

  /**
   * If the API you're using offers alternate server URLs, and server variables, you can tell
   * the SDK which one to use with this method. To use it you can supply either one of the
   * server URLs that are contained within the OpenAPI definition (along with any server
   * variables), or you can pass it a fully qualified URL to use (that may or may not exist
   * within the OpenAPI definition).
   *
   * @example <caption>Server URL with server variables</caption>
   * sdk.server('https://{region}.api.example.com/{basePath}', {
   *   name: 'eu',
   *   basePath: 'v14',
   * });
   *
   * @example <caption>Fully qualified server URL</caption>
   * sdk.server('https://eu.api.example.com/v14');
   *
   * @param url Server URL
   * @param variables An object of variables to replace into the server URL.
   */
  server(url: string, variables = {}) {
    this.core.setServer(url, variables);
  }

  /**
   * Create an account
   *
   */
  postSignup(body: types.PostSignupBodyParam): Promise<FetchResponse<200, types.PostSignupResponse200>> {
    return this.core.fetch('/signup', 'post', body);
  }

  /**
   * Get authorization account
   *
   */
  postSignin(body: types.PostSigninBodyParam): Promise<FetchResponse<200, types.PostSigninResponse200>> {
    return this.core.fetch('/signin', 'post', body);
  }

  /**
   * Generate a Sale
   *
   */
  postSale(body: types.PostSaleBodyParam): Promise<FetchResponse<200, types.PostSaleResponse200>> {
    return this.core.fetch('/sale', 'post', body);
  }

  /**
   * Card token
   *
   */
  postCardTokenizer(body: types.PostCardTokenizerBodyParam): Promise<FetchResponse<200, types.PostCardTokenizerResponse200>> {
    return this.core.fetch('/card/tokenizer', 'post', body);
  }

  /**
   * Payment information
   *
   */
  getTransactionOrderid(metadata: types.GetTransactionOrderidMetadataParam): Promise<FetchResponse<200, types.GetTransactionOrderidResponse200>> {
    return this.core.fetch('/transaction/{orderId}', 'get', metadata);
  }

  /**
   * Payment information by reference
   *
   */
  getTransactionReferenceReference(metadata: types.GetTransactionReferenceReferenceMetadataParam): Promise<FetchResponse<200, types.GetTransactionReferenceReferenceResponse200>> {
    return this.core.fetch('/transaction/reference/{reference}', 'get', metadata);
  }

  /**
   * Refund sale
   *
   */
  postRefund(body: types.PostRefundBodyParam): Promise<FetchResponse<200, types.PostRefundResponse200>> {
    return this.core.fetch('/refund', 'post', body);
  }

  /**
   * Reversal sale
   *
   */
  postReversal(body: types.PostReversalBodyParam): Promise<FetchResponse<200, types.PostReversalResponse200>> {
    return this.core.fetch('/reversal', 'post', body);
  }

  /**
   * Get tokenized cards
   *
   */
  getCards(): Promise<FetchResponse<200, types.GetCardsResponse200>> {
    return this.core.fetch('/cards', 'get');
  }
}

const createSDK = (() => { return new SDK(); })()
;

export default createSDK;

export type { GetCardsResponse200, GetTransactionOrderidMetadataParam, GetTransactionOrderidResponse200, GetTransactionReferenceReferenceMetadataParam, GetTransactionReferenceReferenceResponse200, PostCardTokenizerBodyParam, PostCardTokenizerResponse200, PostRefundBodyParam, PostRefundResponse200, PostReversalBodyParam, PostReversalResponse200, PostSaleBodyParam, PostSaleResponse200, PostSigninBodyParam, PostSigninResponse200, PostSignupBodyParam, PostSignupResponse200 } from './types';
