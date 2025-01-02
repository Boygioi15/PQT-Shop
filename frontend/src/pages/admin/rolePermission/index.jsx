import React, { useEffect, useState } from "react";
import {
  Plus,
  Trash2,
  X,
  ChevronRight,
  ChevronDown,
  Shield,
} from "lucide-react";
import RoleDetailsPanel from "../../../component/admin/rolePermission/RoleDetailsPanel";
import { createRole, deleteRole, getAllRole } from "../../../config/api";
import { toast } from "react-toastify";

const RBACManager = () => {
  const [roles, setRoles] = useState([]);
  const [selectedRole, setSelectedRole] = useState(null);
  const [showRoleModal, setShowRoleModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [roleToDelete, setRoleToDelete] = useState(null);
  const [newRole, setNewRole] = useState({
    name: "",
    description: "",
    grants: [],
  });

  const handleGetALLRole = async () => {
    const response = await getAllRole();
    const roleMap = response.metadata.map((role) => {
      return {
        id: role._id,
        name: role.rol_name,
        slug: role.rol_slug,
        description: role.rol_description,
        grants: role.rol_grants,
      };
    });
    setRoles(roleMap);
  };

  useEffect(() => {
    handleGetALLRole();
  }, []);

  const addRole = async () => {
    const response = await createRole({ ...newRole });
    if (response.status === 200) {
      toast.success("Tạo mới role thành công");
      await handleGetALLRole();
      setShowRoleModal(false);
      setNewRole({ name: "", description: "", grants: [] });
    } else {
      toast.error("Tạo mới role thất bại");
    }
  };

  const handleDeleteClick = (roleId, roleName) => {
    setRoleToDelete({ id: roleId, name: roleName });
    setShowDeleteModal(true);
  };

  const handleConfirmDelete = async () => {
    const response = await deleteRole(roleToDelete.id);
    if (response.status === 200) {
      toast.success("Xóa thành công");
      handleGetALLRole();
      setShowDeleteModal(false);
      setRoleToDelete(null);
    } else {
      toast.error(response.message);
    }
  };

  return (
    <div className="w-full mx-auto p-6 gap-y-6">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-3">
          <Shield className="w-8 h-8 text-blue-500" />
          <h1 className="text-2xl font-bold text-gray-900">RBAC Manager</h1>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="p-6 border-b border-gray-200">
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-semibold text-gray-900">
              Role Management
            </h2>
            <button
              onClick={() => setShowRoleModal(true)}
              className="flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg transition-colors duration-200"
            >
              <Plus size={16} />
              Add Role
            </button>
          </div>
        </div>

        <div className="divide-y divide-gray-200">
          {roles.map((role) => (
            <div key={role.slug}>
              <div
                className="flex items-center justify-between p-4 cursor-pointer hover:bg-gray-50 transition-colors duration-200"
                onClick={() =>
                  setSelectedRole(selectedRole === role.slug ? null : role.slug)
                }
              >
                <div className="flex items-center gap-3">
                  {selectedRole === role.slug ? (
                    <ChevronDown size={20} className="text-gray-400" />
                  ) : (
                    <ChevronRight size={20} className="text-gray-400" />
                  )}
                  <div>
                    <h3 className="font-medium text-gray-900">{role.name}</h3>
                    <p className="text-sm text-gray-500">
                      {role.grants.length} permission
                      {role.grants.length !== 1 ? "s" : ""}
                    </p>
                  </div>
                </div>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDeleteClick(role.id, role.name);
                  }}
                  className="p-2 hover:bg-red-50 rounded-full text-red-500 hover:text-red-600 transition-colors duration-200"
                >
                  <Trash2 size={16} />
                </button>
              </div>

              {selectedRole === role.slug && (
                <RoleDetailsPanel
                  role={role}
                  roles={roles}
                  setRoles={setRoles}
                />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Add Role Modal */}
      {showRoleModal && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center">
          <div className="bg-white rounded-xl shadow-lg w-96 p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-900">
                Add New Role
              </h3>
              <button
                onClick={() => setShowRoleModal(false)}
                className="p-1.5 hover:bg-gray-100 rounded-full text-gray-500 hover:text-gray-700 transition-colors duration-200"
              >
                <X size={16} />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Role Name
                </label>
                <input
                  type="text"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                  value={newRole.name}
                  onChange={(e) =>
                    setNewRole({ ...newRole, name: e.target.value })
                  }
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <input
                  type="text"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                  value={newRole.description}
                  onChange={(e) =>
                    setNewRole({ ...newRole, description: e.target.value })
                  }
                />
              </div>

              <button
                onClick={addRole}
                className="w-full bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition-colors duration-200"
              >
                Add Role
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center">
          <div className="bg-white rounded-xl shadow-lg w-96 p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-900">
                Confirm Delete
              </h3>
              <button
                onClick={() => {
                  setShowDeleteModal(false);
                  setRoleToDelete(null);
                }}
                className="p-1.5 hover:bg-gray-100 rounded-full text-gray-500 hover:text-gray-700 transition-colors duration-200"
              >
                <X size={16} />
              </button>
            </div>

            <div className="space-y-4">
              <p className="text-gray-600">
                Are you sure you want to delete the role "{roleToDelete?.name}"?
                This action cannot be undone.
              </p>

              <div className="flex gap-3 justify-end">
                <button
                  onClick={() => {
                    setShowDeleteModal(false);
                    setRoleToDelete(null);
                  }}
                  className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors duration-200"
                >
                  Cancel
                </button>
                <button
                  onClick={handleConfirmDelete}
                  className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors duration-200"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RBACManager;
