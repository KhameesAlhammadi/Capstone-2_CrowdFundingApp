/* eslint-disable */
import * as Router from 'expo-router';

export * from 'expo-router';

declare module 'expo-router' {
  export namespace ExpoRouter {
    export interface __routes<T extends string | object = string> {
      hrefInputParams: { pathname: Router.RelativePathString, params?: Router.UnknownInputParams } | { pathname: Router.ExternalPathString, params?: Router.UnknownInputParams } | { pathname: `/`; params?: Router.UnknownInputParams; } | { pathname: `/Portfolio`; params?: Router.UnknownInputParams; } | { pathname: `/profilePage`; params?: Router.UnknownInputParams; } | { pathname: `/SearchBar`; params?: Router.UnknownInputParams; } | { pathname: `/_sitemap`; params?: Router.UnknownInputParams; } | { pathname: `${'/(Property)'}/PropertyList` | `/PropertyList`; params?: Router.UnknownInputParams; } | { pathname: `/services/propertyService`; params?: Router.UnknownInputParams; };
      hrefOutputParams: { pathname: Router.RelativePathString, params?: Router.UnknownOutputParams } | { pathname: Router.ExternalPathString, params?: Router.UnknownOutputParams } | { pathname: `/`; params?: Router.UnknownOutputParams; } | { pathname: `/Portfolio`; params?: Router.UnknownOutputParams; } | { pathname: `/profilePage`; params?: Router.UnknownOutputParams; } | { pathname: `/SearchBar`; params?: Router.UnknownOutputParams; } | { pathname: `/_sitemap`; params?: Router.UnknownOutputParams; } | { pathname: `${'/(Property)'}/PropertyList` | `/PropertyList`; params?: Router.UnknownOutputParams; } | { pathname: `/services/propertyService`; params?: Router.UnknownOutputParams; };
      href: Router.RelativePathString | Router.ExternalPathString | `/${`?${string}` | `#${string}` | ''}` | `/Portfolio${`?${string}` | `#${string}` | ''}` | `/profilePage${`?${string}` | `#${string}` | ''}` | `/SearchBar${`?${string}` | `#${string}` | ''}` | `/_sitemap${`?${string}` | `#${string}` | ''}` | `${'/(Property)'}/PropertyList${`?${string}` | `#${string}` | ''}` | `/PropertyList${`?${string}` | `#${string}` | ''}` | `/services/propertyService${`?${string}` | `#${string}` | ''}` | { pathname: Router.RelativePathString, params?: Router.UnknownInputParams } | { pathname: Router.ExternalPathString, params?: Router.UnknownInputParams } | { pathname: `/`; params?: Router.UnknownInputParams; } | { pathname: `/Portfolio`; params?: Router.UnknownInputParams; } | { pathname: `/profilePage`; params?: Router.UnknownInputParams; } | { pathname: `/SearchBar`; params?: Router.UnknownInputParams; } | { pathname: `/_sitemap`; params?: Router.UnknownInputParams; } | { pathname: `${'/(Property)'}/PropertyList` | `/PropertyList`; params?: Router.UnknownInputParams; } | { pathname: `/services/propertyService`; params?: Router.UnknownInputParams; };
    }
  }
}
