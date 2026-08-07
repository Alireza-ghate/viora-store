"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { Button } from "../ui/button";
import qs from "query-string";

interface PaginationProps {
  page: number | string;
  totalPages: number;
  urlParamName?: string;
}

function formUrlQuery({
  params,
  key,
  value,
}: {
  params: string;
  key: string;
  value: string | null;
}) {
  const query = qs.parse(params);
  query[key] = value;

  return qs.stringifyUrl(
    {
      url: window.location.pathname, // same as base url
      query, // search params url
    },
    { skipNull: true },
  );
}

function Pagination({ page, totalPages, urlParamName }: PaginationProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  function handleClick(btnType: string) {
    const pageValue = btnType === "next" ? Number(page) + 1 : Number(page) - 1;

    const url = formUrlQuery({
      params: searchParams.toString(),
      key: urlParamName || "page",
      value: pageValue.toString(),
    });

    router.push(url);
  }
  return (
    <div className="flex gap-x-2 items-center mt-5 lg:mt-10 justify-center">
      <Button
        onClick={() => handleClick("prev")}
        disabled={Number(page) <= 1}
        className="w-28"
        variant="outline"
        size="lg"
      >
        Previous
      </Button>

      <span className="mx-1 flex items-center justify-center p-1 w-10 border rounded-lg">
        {page}
      </span>
      <Button
        onClick={() => handleClick("next")}
        disabled={Number(page) >= totalPages}
        className="w-28"
        variant="outline"
        size="lg"
      >
        Next
      </Button>
    </div>
  );
}

export default Pagination;
