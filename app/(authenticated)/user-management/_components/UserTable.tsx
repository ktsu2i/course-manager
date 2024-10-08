"use client";

import toast from "react-hot-toast";
import axios from "axios";
import { useRouter } from "next/navigation";
import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown, Trash2 } from "lucide-react";

import { DataTable } from "@/app/(authenticated)/user-management/_components/DataTable";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";

import UpdateUserAlert from "./UpdateUserAlert";
import { User } from "@/lib/types";

interface UserTableProps {
  users: User[];
  currentUser: User | null;
}

const UserTable: React.FC<UserTableProps> = ({ users, currentUser }) => {
  const router = useRouter();

  const handleDelete = async (userId: string) => {
    try {
      const uniqueUser = users.find((user) => user.id === userId);
      // const clerkUserId = uniqueUser?.clerkUserId;
      // await axios.delete("/api/users", { data: { userId, clerkUserId } });
      toast.success("User deleted!");
      router.refresh();
    } catch {
      toast.error("Something went wrong");
    }
  };

  const columns: ColumnDef<User>[] = [
    {
      accessorKey: "tuid",
      header: "TUID",
    },
    {
      accessorKey: "fullName",
      header: ({ column }) => {
        return (
          <Button
            className="pl-0"
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Name
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
    },
    {
      accessorKey: "tuMail",
      header: "TUmail",
    },
    {
      accessorKey: "roles",
      header: "Roles",
      cell: ({ row }) => {
        const isAdmin = row.original.isAdmin;
        const isCoordinator = row.original.isCoordinator;
        const isFaculty = row.original.isFaculty;
        const isStaff = row.original.isStaff;
        const isGuest = !isAdmin && !isCoordinator && !isFaculty && !isStaff;

        return (
          <div className="flex items-center">
            {isAdmin && (
              <Badge className="bg-red-400/20 text-red-700 ml-2">Admin</Badge>
            )}
            {isCoordinator && (
              <Badge className="bg-blue-400/20 text-blue-700 ml-2">
                Coordinator
              </Badge>
            )}
            {isFaculty && (
              <Badge className="bg-green-400/20 text-green-700 ml-2">
                Faculty
              </Badge>
            )}
            {isStaff && (
              <Badge className="bg-orange-400/20 text-orange-700 ml-2">
                Staff
              </Badge>
            )}
            {isGuest && (
              <Badge className="bg-gray-400/20 text-gray-700 ml-2">Guest</Badge>
            )}
          </div>
        );
      },
    },
    {
      accessorKey: "id",
      header: "",
      cell: ({ row }) => {
        return (
          <div className="flex gap-x-2">
            <UpdateUserAlert
              users={users}
              userId={row.getValue("id")}
              disabled={currentUser?.id === row.getValue("id")}
            />
            <AlertDialog>
              <AlertDialogTrigger
                disabled={currentUser?.id === row.getValue("id")}
              >
                <Button
                  size="sm"
                  variant="destructive"
                  disabled={currentUser?.id === row.getValue("id")}
                >
                  <Trash2 className="h-5 w-5" />
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Confirmation</AlertDialogTitle>
                  <AlertDialogDescription>
                    Are you sure you want to delete &apos;
                    {row.getValue("fullName")}&apos;?
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction
                    className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                    onClick={() => handleDelete(row.getValue("id"))}
                  >
                    Delete
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        );
      },
    },
  ];

  return <DataTable columns={columns} data={users} />;
};

export default UserTable;
