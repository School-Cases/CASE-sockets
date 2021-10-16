export const SearchChatrooms = ({
  page,
  checkbox,
  setCheckbox,
  setSearchChatrooms,
}) => {
  return (
    <section>
      <input
        type="text"
        name=""
        id=""
        placeholder="search chatrooms"
        onInput={(e) => setSearchChatrooms(e.target.value)}
      />

      {page === "home" ? (
        <div>
          <label htmlFor="searchJoinableChatroomsCheckbox">
            search joinable rooms:
          </label>
          <input
            type="checkbox"
            name="searchJoinableChatroomsCheckbox"
            id=""
            onChange={(e) => setCheckbox(e.target.checked)}
          />
        </div>
      ) : null}
    </section>
  );
};
