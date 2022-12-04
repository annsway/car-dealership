import moment from "moment";

export const post = async (url, data) => {
  const resp = await fetch(url, {
    method: 'post',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  })

  let resp_res = await resp.json()
  console.log(resp_res)
  return resp_res
}

export const get = async (url) => {
  const resp = await fetch(url, {
    headers: {
      Accept: 'application/json',
    },
  })
  return resp.json()
}

export const getDateFormat = (date_epoch) => {
  if (date_epoch == null || date_epoch.length == 0)
  {
    return date_epoch
  }

  return moment(date_epoch).format("YYYY-MM-DD");
  // var date = new Date(date_epoch)
  // var date_disp =
  //   date.getFullYear() +
  //   '-' +
  //   date.getMonth() +
  //   '-' +
  //   date.getDate() +
  //   ' ' +
  //   date.getHours() +
  //   ':' +
  //   date.getMinutes() +
  //   ':' +
  //   date.getSeconds()
  // return date_disp
}
