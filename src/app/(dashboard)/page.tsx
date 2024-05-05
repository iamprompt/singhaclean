const Page = () => {
  return (
    <div>
      {Array.from({ length: 1000 }).map((_, i) => (
        <div className="font-bold" key={i}>
          สวัสดี
        </div>
      ))}
    </div>
  )
}

export default Page
