export default function useAppUrl() {
  const config = useRuntimeConfig()
  return config.public.appUrl
}
