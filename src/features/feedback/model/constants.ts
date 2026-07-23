import type { BugFormState, FeedbackMode, FeedbackSuccessDialogState, InquiryFormState, SubmitAction } from './types';

export const FEEDBACK_INITIAL_MODE: FeedbackMode = 'bug';

export const SUBMIT_ACTIONS = {
  bug: 'issues',
  inquiry: 'feedback',
} as const satisfies Record<FeedbackMode, SubmitAction>;

export const DEFAULT_BUG_FORM: BugFormState = {
  title: '',
  detail: '',
  contact: '',
  includeApp: true,
  includeDevice: true,
  includeLog: true,
};

export const DEFAULT_INQUIRY_FORM: InquiryFormState = {
  title: '',
  detail: '',
  contact: '',
};

export const EMPTY_SUCCESS_DIALOG: FeedbackSuccessDialogState = {
  open: false,
  message: '',
  url: '',
};
