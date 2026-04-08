export default function HelloWorld() {
  return (
    <div>
      <h1>Hello World</h1>
      <p>Selamat Belajar ReactJs</p>
      <UserCard
        nama="syabil"
        nim="2457301098"
        tanggal={new Date().toLocaleDateString()}
      />
      <QuoteText />
      <GreetingBinjai />
    </div>
  );
}

function GreetingBinjai() {
  return <small>salam dari binjai</small>;
}

function QuoteText() {
  const text = "Mulutmu Harimaumu";
  const text2 = "Aku ingin jadi macan";
  return (
    <div>
      <hr />
      <p>{text.toLowerCase()}</p>
      <p>{text2.toUpperCase()}</p>
    </div>
  );
}

function UserCard(props) {
  return (
    <div>
      <img src="img/Picture1.jpg" alt="logo" />
      <hr />
      <h3>Nama: {props.nama}</h3>
      <p>NIM: {props.nim}</p>
      <p>Tanggal: {props.tanggal}</p>
    </div>
  );
}
