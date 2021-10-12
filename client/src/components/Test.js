export const Test = () => {
  return (
    <section>
      <h1>react</h1>
      <section>
        <h3>user</h3>
        <form action="http://localhost:5002/create-user" method="post">
          <input type="text" name="name" id="name" placeholder="username" />
          <input
            type="text"
            name="password"
            id="password"
            placeholder="password"
          />
          <select name="avatar" id="avatar">
            <option value="0">avatar 1</option>
            <option value="1">avatar 2</option>
            <option value="2">avatar 3</option>
          </select>
          <select name="theme" id="theme">
            <option value="0">olf theme</option>
            <option value="1">pokemon theme</option>
          </select>
          <button type="submit">skapa user</button>
        </form>
      </section>

      <section>
        <h3>chatroom</h3>
        <form action="http://localhost:5002/create-chatroom" method="post">
          <input
            type="text"
            name="name"
            id="name"
            placeholder="chatroom name"
          />

          <select name="theme" id="theme">
            <option value="0">olf theme</option>
            <option value="1">pokemon theme</option>
          </select>

          <label htmlFor="starmarked">favorisera:</label>
          <input type="checkbox" name="starmarked" id="starmarked" />
          <button type="submit">skapa chatroom</button>
        </form>
      </section>

      <section>
        <h3>message</h3>
        <form action="http://localhost:5002/create-message" method="post">
          <input
            type="text"
            name="chatroom"
            id="chatroom"
            value="615c2d2fd982a59dd64735e6"
          />
          <input
            type="text"
            name="sender"
            id="sender"
            value="615c2c4d334ce5c66f8bcbd9"
          />

          <input type="text" name="text" id="text" placeholder="text" />

          <button type="submit">skapa message chatroom1 from haakon</button>
        </form>
      </section>
    </section>
  );
};
