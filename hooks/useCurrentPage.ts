import { useLocalSearchParams, usePathname, useSegments } from 'expo-router';
import { useMemo } from 'react';

export interface CurrentPageInfo {
  pathname: string;
  segments: string[];
  params: Record<string, string | string[]>;
  pageName: string;
  isIdentityPage: boolean;
  isModal: boolean;
}

export default function useCurrentPage(): CurrentPageInfo {
  const pathname = usePathname();
  const segments = useSegments();
  const params = useLocalSearchParams();

  const pageInfo = useMemo(() => {
    // get the page name (the last segment)
    const pageName = segments[segments.length - 1] || '';

    // judge whether the current page is the identity page
    const isIdentityPage = segments[0] === 'identity';

    // judge whether the current page is the modal page (usually starts with +)
    const isModal = segments.some((segment) => segment.startsWith('+'));

    return {
      pathname,
      segments,
      params,
      pageName,
      isIdentityPage,
      isModal,
    };
  }, [pathname, segments, params]);

  return pageInfo;
}
