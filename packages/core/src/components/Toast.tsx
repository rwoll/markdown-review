import { toastMessage, toastVisible } from '../state';

export function Toast() {
  return (
    <div class={`toast ${toastVisible.value ? 'show' : ''}`}>
      {toastMessage.value}
    </div>
  );
}
