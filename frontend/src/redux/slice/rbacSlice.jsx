// features/rbac/rbacSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { getUserRole } from "../../config/api";

export const fetchUserRole = createAsyncThunk(
  "rbac/fetchUserRole",
  async (_, { rejectWithValue }) => {
    try {
      const response = await getUserRole();
      console.log("🚀 ~ response:", response);

      if (response.status !== 200) {
        throw new Error("Failed to fetch role");
      }

      const data = response.metadata;

      const roles = {
        name: data.rol_name,
        slug: data.rol_slug,
        status: data.rol_status,
        grants: data.rol_grants.reduce((acc, grant) => {
          const resourceId = grant.resource.src_name || grant.resource;
          acc[resourceId] = {
            actions: grant.actions,
            attributes: grant.attributes,
          };
          return acc;
        }, {}),
      };
      console.log("🚀 ~ roles:", roles);

      return roles;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const rbacSlice = createSlice({
  name: "rbac",
  initialState: {
    userRole: null,
    loading: false,
    error: null,
  },
  reducers: {
    clearRoleData: (state) => {
      state.userRole = null;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUserRole.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUserRole.fulfilled, (state, action) => {
        state.loading = false;
        state.userRole = action.payload;
      })
      .addCase(fetchUserRole.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

// Selectors
export const selectUserRole = (state) => state.rbac.userRole;
export const selectRbacLoading = (state) => state.rbac.loading;
export const selectRbacError = (state) => state.rbac.error;

// Helper function to check permissions
export const checkPermission = (state, resourceId, action) => {
  const userRole = selectUserRole(state);

  if (!userRole || userRole.status !== "active") return false;

  const resourceGrants = userRole.grants[resourceId];
  if (!resourceGrants) return false;

  return resourceGrants.actions.includes(action);
};

export const { clearRoleData } = rbacSlice.actions;

export default rbacSlice.reducer;
