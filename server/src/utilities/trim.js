export const trim = (text) => {
  let start = 0;
  let end = text.length - 1;

  // Mover el índice de inicio hacia adelante mientras haya espacios en blanco
  while (start <= end && text[start] === ' ') {
    start++;
  }

  // Mover el índice de fin hacia atrás mientras haya espacios en blanco
  while (end >= start && text[end] === ' ') {
    end--;
  }

  // Devolver la subcadena entre los índices de inicio y fin, inclusive
  let result = '';
  for (let i = start; i <= end; i++) {
    result += text[i];
  }

  return result
};