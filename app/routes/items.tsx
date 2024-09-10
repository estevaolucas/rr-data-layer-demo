import { startTransition, useEffect, useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { LoaderFunction } from "@remix-run/node";
import {
  Form,
  Outlet,
  json,
  useFetcher,
  useLoaderData,
  useNavigate,
  useRevalidator,
  useSearchParams,
} from "@remix-run/react";
import { ArrowUpDown, Search } from "lucide-react";
import { InfiniteScroller } from "@/components/InfinityScroller";
import { Skeleton } from "@/components/ui/skeleton";

interface Product {
  id: string;
  name: string;
  images: string[];
  description: string;
  title: string;
  thumbnail: string;
}

export const clientLoader: LoaderFunction = async ({ request }) => {
  const url = new URL(window.location.href);
  const requestUrl = new URL(request.url);

  const nextPage = requestUrl.searchParams.get("nextPage") || 0;
  const searchQuery = url.searchParams.get("search") || "";
  const order = url.searchParams.get("sortOrder") || "asc";

  const queryParams = new URLSearchParams({
    skip: String(nextPage),
    limit: "10",
    q: searchQuery,
    order,
    sortBy: "title",
  });

  const response = await fetch(
    searchQuery
      ? `https://dummyjson.com/products/search?${queryParams}`
      : `https://dummyjson.com/products?${queryParams}`,
    { mode: "cors" }
  );

  const data = await response.json();

  return json({ products: data.products, page: data.skip });
};

interface Data {
  products: Product[];
  page: number;
}

const Library = () => {
  const data = useLoaderData<Data>();
  const revalidator = useRevalidator();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const fetcher = useFetcher<Data>();

  const [products, setProducts] = useState<Product[]>(data.products);

  // Sync the items state with loader data on data change after a search
  useEffect(() => {
    setProducts(data.products);
  }, [data.products]);

  // Append items data to items state
  useEffect(() => {
    if (!fetcher.data || fetcher.state === "loading") return;

    if (fetcher.data) {
      const { products } = fetcher.data;
      setProducts((prevAssets) => [...prevAssets, ...products]);
    }
  }, [fetcher.data, fetcher.state]);

  const searchQuery = searchParams.get("search") || "";

  const onItemClick = (id: string) => {
    navigate(`/items/${id}`);
  };

  const onSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const url = new URL(window.location.href);
    url.searchParams.set("search", e.currentTarget.value);
    window.history.pushState(null, "", url.toString());

    setProducts([]);
    revalidator.revalidate();
  };

  const onSortOrderToggle = () => {
    const url = new URL(window.location.href);
    const sortOrder = url.searchParams.get("sortOrder") || "asc";

    url.searchParams.set("sortOrder", sortOrder === "asc" ? "desc" : "asc");
    window.history.pushState(null, "", url.toString());

    revalidator.revalidate();
  };

  // A method for fetching next page
  const onLoadNext = () => {
    const url = new URL(window.location.href);
    const page = fetcher.data ? fetcher.data.page : data.page;

    url.searchParams.set("nextPage", String(page + 10));
    const query = `?${url.searchParams.toString()}`;
    fetcher.load(query); // this call will trigger the loader with a new query
  };

  return (
    <>
      <div className="container mx-auto p-4">
        <h1 className="text-2xl font-bold mb-4">Items</h1>

        <div className="flex justify-between items-center mb-4">
          <div className="relative">
            <Form method="post" className="flex items-center">
              <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <Input
                name="search"
                className="pl-8 w-64"
                placeholder="Filter products..."
                defaultValue={searchQuery}
                onChange={onSearchChange}
              />
            </Form>
          </div>
        </div>

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[100px]">Image</TableHead>
              <TableHead>
                <Button variant="ghost" onClick={onSortOrderToggle}>
                  Name
                  <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <InfiniteScroller
              loadNext={onLoadNext}
              loading={fetcher.state === "loading"}
            >
              {/** add loader */}

              {products.map((product) => (
                <TableRow
                  key={product.id}
                  onClick={() => onItemClick(product.id)}
                  className="cursor-pointer hover:bg-gray-100"
                >
                  <TableCell>
                    <img
                      src={product.thumbnail}
                      alt={product.name}
                      className="w-12 h-12 object-cover rounded"
                    />
                  </TableCell>
                  <TableCell>{product.title}</TableCell>
                </TableRow>
              ))}

              {fetcher.state === "loading" && (
                <TableRow
                  key={"a"}
                  className="cursor-pointer hover:bg-gray-100"
                >
                  <TableCell>
                    <Skeleton className="h-10 w-[50px]" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-4 w-[240px]" />
                  </TableCell>
                </TableRow>
              )}
            </InfiniteScroller>
          </TableBody>
        </Table>
      </div>
      <Outlet />
    </>
  );
};

export default Library;
