import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import UserTable from "../../../component/admin/user/UserTable";
import {
  getListRole,
  getAllUsers,
  lockUser,
  changeRole,
} from "../../../config/api";
import Loading from "../../../component/Loading";
import CustomSelect from "../../../component/CustomSelect";
import RoleUpdateModal from "../../../component/admin/user/RoleUpdateModal";
import {
  AiOutlineDown,
  AiOutlineEdit,
  AiOutlineLock,
  AiOutlineUnlock,
} from "react-icons/ai";
import Pagination from "../../../component/Pagiantion";

const ITEMS_PER_PAGE = 4;

const UserPage = () => {
  const [users, setUsers] = useState([]);
  const [roles, setRoles] = useState([]);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [filters, setFilters] = useState({ name: "", role: "" });
  const [isLoading, setIsLoading] = useState(false);
  const [activeCollapse, setActiveCollapse] = useState(null);
  const [modalUser, setModalUser] = useState(null);

  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    fetchRoles();
    fetchUsers();
  }, [filters, currentPage]);

  useEffect(() => {
    fetchRoles();
    fetchUsers();
  }, []);

  const fetchRoles = async () => {
    try {
      const response = await getListRole();
      if (response && response.metadata) {
        setRoles(response.metadata);
      }
    } catch (error) {
      console.error("Error fetching roles:", error);
    }
  };

  const fetchUsers = async () => {
    setIsLoading(true);
    try {
      const response = await getAllUsers({
        ...filters,
        page: currentPage,
        limit: ITEMS_PER_PAGE,
      });

      if (response && response.metadata) {
        setUsers(response.metadata.users);
        setTotalPages(response.metadata.pagination.totalPages);
      }
    } catch (error) {
      console.error("Error fetching users:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleToggleLockUser = async (userId, status) => {
    try {
      setIsLoading(true);
      const response = await lockUser(userId, status);
      if (response && response.status === 200) {
        toast.success(
          `User has been ${
            status === "active" ? "unlocked" : "locked"
          } successfully!`
        );
        await fetchUsers();
      } else {
        toast.error("Failed to update user status. Please try again.");
      }
    } catch (error) {
      toast.error("Error updating user status. Please try again.");
      console.error("Error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleUpdateRole = async (userId, roleId) => {
    try {
      setIsLoading(true);
      const response = await changeRole(userId, roleId);
      if (response && response.status === 200) {
        toast.success("Role updated successfully!");
        await fetchUsers();
        setModalUser(null);
      } else {
        toast.error("Failed to update role. Please try again.");
      }
    } catch (error) {
      toast.error("Error updating role. Please try again.");
      console.error("Error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleCollapse = (userId) => {
    setActiveCollapse((prev) => (prev === userId ? null : userId));
  };

  return (
    <div className="p-6 min-h-screen">
      <div className="flex justify-between bg-white px-6 py-8 rounded-lg items-center mb-6">
        <h1 className="text-4xl font-bold text-gray-700">User Management</h1>
        <Link
          to="/admin/users/add"
          className="ml-4 flex items-center bg-mainColor text-white px-4 py-2 rounded hover:bg-blue-700 shadow-md"
        >
          Add User
        </Link>
      </div>

      <div className="flex gap-4 items-center mb-6">
        <input
          type="text"
          name="name"
          value={filters.name}
          onChange={(e) => setFilters({ ...filters, name: e.target.value })}
          placeholder="Search by name"
          className="px-4 py-2 border rounded-lg w-1/3"
        />
        <CustomSelect
          options={[
            { value: "", label: "All Roles" },
            ...roles.map((role) => ({ value: role._id, label: role.rol_name })),
          ]}
          value={filters.role}
          onChange={(role) => setFilters({ ...filters, role })}
          placeholder="Select Role"
        />
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center min-h-[300px]">
          <Loading />
        </div>
      ) : (
        <>
          <div className="hidden md:block">
            <UserTable
              users={users}
              selectedUsers={selectedUsers}
              setSelectedUsers={setSelectedUsers}
              handleToggleLockUser={handleToggleLockUser}
              refreshUsers={fetchUsers}
            />
          </div>

          <div className="md:hidden">
            {users.map((user) => (
              <div key={user._id} className="bg-white shadow rounded-lg mb-4">
                <div className="p-4 flex justify-between items-center">
                  <div className="flex items-center gap-4">
                    <img
                      src={user.usr_avatar || "https://via.placeholder.com/50"}
                      alt={user.usr_name}
                      className="h-10 w-10 rounded-full object-cover"
                    />
                    <div>
                      <p className="font-semibold text-gray-700">
                        {user.usr_name}
                      </p>
                      <p className="text-sm text-gray-500">{user.usr_email}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 text-xl">
                    {user.usr_status === "active" ? (
                      <AiOutlineUnlock
                        className="text-green-500 cursor-pointer hover:text-green-700 text-2xl"
                        onClick={() => handleToggleLockUser(user._id, "block")}
                      />
                    ) : (
                      <AiOutlineLock
                        className="text-red-500 cursor-pointer hover:text-red-700 text-2xl"
                        onClick={() => handleToggleLockUser(user._id, "active")}
                      />
                    )}
                    <AiOutlineEdit
                      className="text-blue-500 cursor-pointer hover:text-blue-700 text-2xl"
                      onClick={() => setModalUser(user)}
                    />
                    <AiOutlineDown
                      className={`text-gray-500 cursor-pointer transform transition-transform text-2xl ${
                        activeCollapse === user._id ? "rotate-180" : ""
                      }`}
                      onClick={() => toggleCollapse(user._id)}
                    />
                  </div>
                </div>
                {activeCollapse === user._id && (
                  <div className="p-4 bg-gray-50">
                    <p>
                      <strong>Email:</strong> {user.usr_email}
                    </p>
                    <p>
                      <strong>Role:</strong> {user.usr_role.rol_name}
                    </p>
                    <p>
                      <strong>Status:</strong> {user.usr_status}
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
          {modalUser && (
            <RoleUpdateModal
              user={modalUser}
              onClose={() => setModalUser(null)}
              onSave={handleUpdateRole}
            />
          )}
        </>
      )}
    </div>
  );
};

export default UserPage;
