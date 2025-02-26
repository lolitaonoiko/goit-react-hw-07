import { createSelector, createSlice, isAllOf } from '@reduxjs/toolkit';

import { addContact, fetchContacts, deleteContact } from './contactsOps';

import { filtersValue } from './filtersSlice';

const handlePending = state => {
  state.loading = true;
  state.error = null;
};

const handleRejected = (state, action) => {
  state.loading = false;
  state.error = action.payload;
};

const initialState = {
  items: [],
  loading: false,
  error: null,
};

const slice = createSlice({
  name: 'contacts',
  initialState,

  extraReducers: builder => {
    builder
      .addCase(fetchContacts.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.items = action.payload;
      })
      .addCase(addContact.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.items.push(action.payload);
      })
      .addCase(deleteContact.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.items = state.items.filter(item => item.id !== action.payload.id);
      })
      .addMatcher(
        isAllOf(
          fetchContacts.pending,
          addContact.pending,
          deleteContact.pending
        ),
        handlePending
      )
      .addMatcher(
        isAllOf(
          fetchContacts.rejected,
          addContact.rejected,
          deleteContact.rejected
        ),
        handleRejected
      );
  },
});

export default slice.reducer;

export const selectProfiles = state => state.contacts.items;

export const selectFilteredContacts = createSelector(
  [selectProfiles, filtersValue],
  (profiles, filter) => {
    return profiles.filter(profile =>
      profile.name.toLowerCase().includes(filter.toLowerCase())
    );
  }
);
