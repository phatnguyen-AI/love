import tuNgayEmDenUrl from '../music.mp3?url'

export type LoveChapter = {
  id: string
  eyebrow: string
  title: string
  text: string
  emphasis?: string
}

export type LoveReplyContent = {
  formId: string
  ctaLabel: string
  title: string
  prompt: string
  successMessage: string
}

export type LovePageContent = {
  senderName: string
  recipientName: string
  intro: string
  chapters: LoveChapter[]
  finalMessage: string
  finalNote: string
  signature: string
  musicUrl?: string
  musicLabel?: string
  reply?: LoveReplyContent
}

/** Đây là file duy nhất cần chỉnh để cá nhân hóa lá thư. */
export const loveContent: LovePageContent = {
  senderName: 'Phát',
  recipientName: 'Vân Anh',
  intro: 'Có những điều anh đã cất thật lâu trong lòng, những điều mỗi lần nghĩ đến đều mang theo hình bóng của em. Hôm nay, anh muốn gom tất cả sự chân thành của mình vào lá thư nhỏ này và gửi đến em.',
  chapters: [
    {
      id: 'first-thought',
      eyebrow: 'Từ ngày em bước đến',
      title: 'Những ngày bình thường cũng mang một màu rất khác',
      text: 'Anh không nhớ chính xác từ khoảnh khắc nào, chỉ biết rằng từ khi có em, những điều nhỏ bé quanh anh bỗng trở nên đáng nhớ hơn. Một câu chuyện em kể, một nụ cười thoáng qua hay chỉ vài dòng tin nhắn cũng đủ làm lòng anh ấm áp và khiến cả ngày dài trở nên dịu dàng hơn.',
      emphasis: 'Có lẽ người đặc biệt không cần làm điều gì lớn lao, bởi chỉ cần xuất hiện thôi cũng đã khiến thế giới của một người thay đổi.',
    },
    {
      id: 'what-i-admire',
      eyebrow: 'Điều anh luôn trân trọng',
      title: 'Là tất cả những gì khiến em trở thành chính em',
      text: 'Anh yêu nụ cười của em, yêu sự chân thành trong từng điều em nói và cả những lúc em chẳng cần cố gắng để trở nên hoàn hảo. Anh trân trọng sự dịu dàng, những cảm xúc thật và cả những nét riêng chỉ em mới có. Với anh, em đẹp nhất khi được sống đúng là mình, bình yên và không phải gồng lên vì bất kỳ ai.',
      emphasis: 'Có em trong cuộc đời, anh không chỉ thấy hạnh phúc hơn mà còn muốn học cách trở thành một người tốt hơn, xứng đáng hơn với tình yêu của em.',
    },
    {
      id: 'honest-feeling',
      eyebrow: 'Một lời thật lòng',
      title: 'Anh đã thử gọi cảm xúc này bằng rất nhiều cái tên',
      text: 'Có lúc anh nghĩ đó chỉ là một chút nhớ nhung, một chút quan tâm nhiều hơn bình thường. Nhưng càng ngày anh càng nhận ra, em đã trở thành một phần rất đặc biệt trong lòng anh. Anh nhớ em trong những khoảng lặng khi mình không nói chuyện, nhớ nụ cười và giọng nói của em, và chỉ cần thấy tên em xuất hiện cũng đủ khiến một ngày của anh trở nên dịu dàng hơn.',
      emphasis: 'Anh không chỉ thích em. Anh yêu em — thật lòng và rất nhiều.',
    },
    {
      id: 'apology',
      eyebrow: 'Điều anh muốn nói bằng tất cả sự chân thành',
      title: 'Anh biết mình đã làm trái tim em tổn thương',
      text: 'Anh biết rằng anh đã sai, đã làm em thất vọng và khiến những cảm xúc đẹp giữa chúng ta trở nên nặng nề. Anh hiểu vì sao em không muốn gặp anh, không còn muốn ôm anh như trước. Anh không muốn dùng bất kỳ lý do nào để biện minh, bởi những tổn thương em đã trải qua là thật, và anh thật lòng xin lỗi vì đã khiến người anh yêu phải buồn.',
      emphasis: 'Anh sẽ kiên nhẫn chờ và cố gắng thay đổi bằng hành động, cho đến khi em sẵn sàng mở lòng và chấp nhận anh thêm một lần nữa.',
    },
    {
      id: 'confession',
      eyebrow: 'Nếu còn một điều anh mong em hiểu',
      title: 'Trái tim anh vẫn luôn hướng về em',
      text: 'Anh biết vài lời lãng mạn không thể làm những tổn thương biến mất, và tình yêu cũng cần nhiều hơn những lời hứa. Điều anh mong là có cơ hội được yêu em đúng cách hơn: biết lắng nghe, biết trân trọng cảm xúc của em và ở bên em bằng sự bình yên. Anh vẫn muốn cùng em đi qua những ngày vui, những ngày mệt mỏi và viết tiếp những kỷ niệm đẹp mà chúng ta từng mong chờ.',
      emphasis: 'Cảm ơn em vì đã đọc đến tận đây, và cảm ơn em vì đã từng bước vào cuộc đời anh như một điều dịu dàng nhất.',
    },
  ],
  finalMessage: 'Anh yêu em rất nhiều.',
  finalNote: 'Tình cảm này không phải là một phút rung động thoáng qua. Đó là nỗi nhớ vẫn ở lại trong những khoảng lặng, là sự quan tâm anh dành cho em mỗi ngày và là mong muốn được ở bên em qua cả những ngày nắng đẹp lẫn những ngày chẳng dễ dàng. Em không cần vội trả lời đâu. Anh chỉ mong một ngày nào đó, khi trái tim em đã bình yên hơn, anh vẫn còn cơ hội được nắm tay em và cùng em bắt đầu lại bằng tất cả sự trân trọng.',
  signature: 'Thương em bằng tất cả sự chân thành, Phát',
  musicUrl: tuNgayEmDenUrl,
  musicLabel: 'Từ ngày em đến',
  // Tạo form tại https://formspree.io, sau đó điền form ID để bật thiệp hồi âm.
  // Ví dụ: formId: 'xpwzgkqr'. Không cần lưu địa chỉ email trong mã nguồn.
  reply: {
    formId: 'xnpqnwyb',
    ctaLabel: 'Gửi anh đôi lời',
    title: 'Đến lượt em nhắn anh',
    prompt: 'Nếu em muốn, hãy để lại vài dòng ở đây. Từng lời em viết đều sẽ được gửi riêng đến anh.',
    successMessage: 'Lời nhắn đã được gửi rồi. Cảm ơn em vì đã hồi âm cho anh ♡',
  },
}
