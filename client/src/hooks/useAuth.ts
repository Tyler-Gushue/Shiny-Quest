export function useAuth() {
  return {
    user: null as { username: string } | null,
    isLoading: false,
  };
}