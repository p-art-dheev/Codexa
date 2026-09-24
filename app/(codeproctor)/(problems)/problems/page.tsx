"use client";
import { problem } from "@/types/types";
import { createColumns } from "./columns";
import { useEffect, useState } from "react";
import { DataTable } from "@/components/data-table";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { Plus } from "lucide-react";
import { PageHeader } from "@/components/page-header";
import { StatusScreen } from "@/components/status-screen";

export default function ProblemsPage() {
  const [data, setData] = useState<problem[]>([]);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 10,
  });
  const [sorting, setSorting] = useState<any[]>([]);
  const [globalFilter, setGlobalFilter] = useState("");
  const [totalRows, setTotalRows] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const router = useRouter();
  const { data: session } = useSession();
  const user = session?.user;

  useEffect(() => {
    if (user) {
      getData();
    }
  }, [pagination, sorting, globalFilter, user]);

  async function getData(): Promise<void> {
    setLoading(true);
    try {
      const sortBy = sorting.length > 0 ? sorting[0].id : "id";
      const sortOrder = sorting.length > 0 && sorting[0].desc ? "desc" : "asc";

      const params = new URLSearchParams({
        page: (pagination.pageIndex + 1).toString(),
        pageSize: pagination.pageSize.toString(),
        search: globalFilter,
        sortBy,
        sortOrder,
      });

      const problems = await fetch(`/api/problems?${params.toString()}`);

      if (!problems.ok) {
        throw new Error("Failed to fetch problems");
      }

      const res = await problems.json();
      setData(res.data);
      setTotalRows(res.total);
      setTotalPages(res.totalPages);
      console.log(res);
    } catch (error) {
      console.error("Error fetching problems:", error);
      setData([]);
    } finally {
      setLoading(false);
    }
  }

  const refetchData = async (): Promise<void> => {
    await getData();
  };

  const columns = createColumns(refetchData, router, user?.role || undefined);

  if (!user) {
    return (
      <StatusScreen
        kind="auth"
        title="Sign in to browse problems"
        description="Use your university Google account to continue."
      />
    );
  }

  return (
    <div>
      <PageHeader
        title="Problems"
        description="Practise, attempt and track coding problems. Search by title to find one quickly."
        actions={
          user.role === "admin" && (
            <Button onClick={() => router.push("/problems/create")}>
              <Plus />
              Create problem
            </Button>
          )
        }
      />
      <div>
        <DataTable
          columns={columns}
          data={data}
          searchColumn="title"
          searchPlaceholder="Search problems…"
          manualPagination={true}
          manualSorting={true}
          manualFiltering={true}
          pageCount={totalPages}
          rowCount={totalRows}
          state={{
            pagination,
            sorting,
            globalFilter,
          }}
          onPaginationChange={setPagination}
          onSortingChange={setSorting}
          onGlobalFilterChange={setGlobalFilter}
          loading={loading}
        />
      </div>
    </div>
  );
}
