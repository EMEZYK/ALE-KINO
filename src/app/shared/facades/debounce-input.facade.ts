import { debounceTime } from 'rxjs';

export function debounceInput() {
  return debounceTime(1000);
}
