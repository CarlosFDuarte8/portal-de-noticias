export const formatRelativeTime = (dateString: string) => {
  const published = new Date(dateString);

  if (isNaN(published.getTime())) {
    return "Data inválida";
  }

  const now = new Date();
  const diffInMilliseconds = now.getTime() - published.getTime();
  const diffInMinutes = Math.floor(diffInMilliseconds / (1000 * 60));
  const diffInHours = Math.floor(diffInMinutes / 60);
  const diffInDays = Math.floor(diffInHours / 24);

  if (diffInDays > 7 || diffInMilliseconds < 0) {
    return published.toLocaleDateString("pt-BR", {
      day: "numeric",
      month: "short",
      hour: "2-digit",
      minute: "2-digit",
    });
  } else if (diffInDays >= 2) {
    return `${diffInDays} dias atrás`;
  } else if (diffInDays === 1) {
    return "Ontem";
  } else if (diffInHours >= 1) {
    return `${diffInHours}h atrás`;
  } else if (diffInMinutes >= 1) {
    return `${diffInMinutes}min atrás`;
  } else {
    return "Agora";
  }
};
