

function padTo2Digits(num: number) {
    return num.toString().padStart(2, '0');
  }
  
  // 👇️ format as "YYYY-MM-DD hh:mm:ss"
  // You can tweak formatting easily
export function formatDate(date: Date) {
    return (
      [padTo2Digits(date.getDate()), padTo2Digits(date.getMonth() + 1), date.getFullYear()].join('.') +
      ' um ' +
      [padTo2Digits(date.getHours()), padTo2Digits(date.getMinutes()), padTo2Digits(date.getSeconds())].join(':') +
      ' Uhr'
    )
  }