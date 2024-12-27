import React, { useEffect, useState } from "react";
import { Plus, Trash2, Lock, Save } from "lucide-react";
import {
  getAllCategory,
  getAllReources,
  updateRole,
} from "../../../config/api";
import { toast } from "react-toastify";
const RoleDetailsPanel = ({ role, setRoles, roles, onSave }) => {
  const [resources, setResources] = useState([
    { id: "66fd8a81cead96ea0174bfc5", name: "Order" },
    { id: "66fe47ab7f12f54567887474", name: "Product" },
  ]);
  const [isAddingPermission, setIsAddingPermission] = useState(false);

  useEffect(() => {
    handleGetAllResources();
  }, []);

  const handleGetAllResources = async () => {
    const response = await getAllReources();
    const resourcesMap = response.metadata.map((resource) => {
      return {
        id: resource.resourceId,
        name: resource.name,
      };
    });
    setResources(resourcesMap);
  };

  const selectedResources = role.grants.map((grant) => grant.resource);
  const availableResources = resources.filter(
    (resource) => !selectedResources.includes(resource.id)
  );

  const [newGrant, setNewGrant] = useState({
    resource: availableResources[0]?.id || "",
    actions: [],
    attributes: "*",
  });

  useEffect(() => {
    if (
      availableResources.length > 0 &&
      !availableResources.find((r) => r.id === newGrant.resource)
    ) {
      setNewGrant((prev) => ({
        ...prev,
        resource: availableResources[0].id,
      }));
    }
  }, [availableResources]);

  const [availableActions] = useState([
    "create:any",
    "read:any",
    "update:any",
    "delete:any",
    "create:own",
    "read:own",
    "update:own",
    "delete:own",
  ]);

  const prepareGrantsForUpdate = () => {
    return role.grants.map((grant) => ({
      resource: grant.resource,
      actions: grant.actions,
      attributes: grant.attributes || "*",
    }));
  };

  const handleSave = async () => {
    const grants = prepareGrantsForUpdate();
    const response = await updateRole({
      id: role.id,
      grants,
    });
    if (response.status === 200) {
      toast.success("Luư thành công");
    } else {
      toast.error("Lưu thất bại");
    }
    await onSave(role.slug, grants);
  };

  const addGrantToRole = (roleSlug) => {
    if (!newGrant.resource || newGrant.actions.length === 0) {
      alert("Please select resource and at least one action");
      return;
    }

    setRoles(
      roles.map((role) => {
        if (role.slug === roleSlug) {
          return {
            ...role,
            grants: [...role.grants, { ...newGrant }],
          };
        }
        return role;
      })
    );

    setNewGrant({
      resource: availableResources[1]?.id || "",
      actions: [],
      attributes: "*",
    });
    setIsAddingPermission(false);
  };

  const removeGrant = (roleSlug, resourceId) => {
    setRoles(
      roles.map((role) => {
        if (role.slug === roleSlug) {
          return {
            ...role,
            grants: role.grants.filter(
              (grant) => grant.resource !== resourceId
            ),
          };
        }
        return role;
      })
    );
  };

  const getResourceName = (resourceId) => {
    return resources.find((r) => r.id === resourceId)?.name || resourceId;
  };

  return (
    <div className="bg-gray-50/50 p-6 border-t border-gray-100 space-y-6">
      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <h3 className="text-sm font-medium text-gray-600">Role Details</h3>
          <button
            onClick={handleSave}
            className="flex items-center gap-2 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition-colors duration-200"
          >
            <Save size={16} />
            Save Changes
          </button>
        </div>
        <p className="text-gray-700">{role.description}</p>
        <p className="text-sm text-gray-500 font-mono">ID: {role.slug}</p>
      </div>

      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="text-sm font-medium text-gray-600">Permissions</h3>
          {availableResources.length > 0 && !isAddingPermission && (
            <button
              onClick={() => setIsAddingPermission(true)}
              className="flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg transition-colors duration-200"
            >
              <Plus size={16} />
              Add Permission
            </button>
          )}
        </div>

        <div className="grid gap-4">
          {role.grants.map((grant, index) => (
            <div
              key={index}
              className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 hover:shadow-md transition-shadow duration-200"
            >
              <div className="flex justify-between items-start">
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <Lock className="w-4 h-4 text-blue-500" />
                    <h4 className="font-medium text-gray-900">
                      {getResourceName(grant.resource)}
                    </h4>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {grant.actions.map((action, idx) => (
                      <span
                        key={idx}
                        className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-blue-50 text-blue-700 border border-blue-100"
                      >
                        {action}
                      </span>
                    ))}
                  </div>
                </div>
                <button
                  onClick={() => removeGrant(role.slug, grant.resource)}
                  className="p-1.5 hover:bg-red-50 rounded-full text-red-500 hover:text-red-600 transition-colors duration-200"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>

        {isAddingPermission && availableResources.length > 0 && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h4 className="text-sm font-medium text-gray-700 mb-4">
              Add New Permission
            </h4>
            <div className="space-y-4">
              <select
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                value={newGrant.resource}
                onChange={(e) =>
                  setNewGrant({ ...newGrant, resource: e.target.value })
                }
              >
                {availableResources.length > 0 &&
                  availableResources.map((resource) => (
                    <option key={resource.id} value={resource.id}>
                      {resource.name}
                    </option>
                  ))}
              </select>

              <div className="grid grid-cols-2 gap-3">
                {availableActions.map((action) => (
                  <label
                    key={action}
                    className="flex items-center gap-2 p-2 hover:bg-gray-50 rounded-lg cursor-pointer"
                  >
                    <input
                      type="checkbox"
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      checked={newGrant.actions.includes(action)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setNewGrant({
                            ...newGrant,
                            actions: [...newGrant.actions, action],
                          });
                        } else {
                          setNewGrant({
                            ...newGrant,
                            actions: newGrant.actions.filter(
                              (a) => a !== action
                            ),
                          });
                        }
                      }}
                    />
                    <span className="text-sm text-gray-700">{action}</span>
                  </label>
                ))}
              </div>

              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => setIsAddingPermission(false)}
                  className="flex items-center justify-center gap-2 bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg transition-colors duration-200"
                >
                  Cancel
                </button>
                <button
                  onClick={() => addGrantToRole(role.slug)}
                  className="flex items-center justify-center gap-2 bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg transition-colors duration-200"
                >
                  <Plus size={16} />
                  Add Permission
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default RoleDetailsPanel;
