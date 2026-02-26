import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const BASE_URL = "http://localhost:3000/api/complaints";

/* ================= FETCH ================= */

export const fetchComplaints = createAsyncThunk(
  "complaints/fetch",
  async (page, { rejectWithValue }) => {
    try {
      const res = await axios.get(`${BASE_URL}?page=${page}&limit=4`);
      return res.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const createComplaint = async (req, res) => {
  try {
    const { name, category, description } = req.body;

    const complaintId = `#CMP-${Math.floor(
      1000 + Math.random() * 9000
    )}`;

    await db.query(
      `INSERT INTO complaint_tbl
       (Complaint_ID, Student_Name, Category, Description)
       VALUES (?, ?, ?, ?)`,
      [complaintId, name, category, description]
    );

    res.status(201).json({
      id: complaintId,
      name,
      category,
      description,
      status: "PENDING",
      date: new Date().toDateString()
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};

/* ================= UPDATE STATUS ================= */

export const updateComplaintStatus = createAsyncThunk(
  "complaints/updateStatus",
  async ({ id, status }, { rejectWithValue }) => {
    try {
      await axios.put(`${BASE_URL}/${id}/status`, { status });
      return { id, status };
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

/* ================= DELETE ================= */

export const deleteComplaint = createAsyncThunk(
  "complaints/delete",
  async (id, { rejectWithValue }) => {
    try {
      await axios.delete(`${BASE_URL}/${id}`);
      return id;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

/* ================= SLICE ================= */

const complaintSlice = createSlice({
  name: "complaints",
  initialState: {
    complaints: [],
    total: 0,
    loading: false,
    error: null
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchComplaints.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchComplaints.fulfilled, (state, action) => {
        state.loading = false;
        state.complaints = action.payload.complaints;
        state.total = action.payload.total;
      })
      .addCase(fetchComplaints.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(updateComplaintStatus.fulfilled, (state, action) => {
        const { id, status } = action.payload;
        const complaint = state.complaints.find(c => c.id === id);
        if (complaint) complaint.status = status;
      })
      .addCase(deleteComplaint.fulfilled, (state, action) => {
        state.complaints = state.complaints.filter(
          c => c.id !== action.payload
        );
      });
  }
});

export default complaintSlice.reducer;