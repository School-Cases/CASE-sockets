import { If } from "../../../utils/If";

export const SearchChatrooms = ({ page, setCheckbox, setSearchChatrooms }) => {
  return (
    <section className="flex search-chatroom-con">
      <input
        type="text"
        placeholder="search chatrooms"
        onInput={(e) => setSearchChatrooms(e.target.value)}
      />

      <If condition={page === "home"}>
        <div className="flex">
          <label htmlFor="searchJoinableChatroomsCheckbox">all:</label>
          <input
            type="checkbox"
            name="searchJoinableChatroomsCheckbox"
            onChange={(e) => setCheckbox(e.target.checked)}
          />
        </div>
      </If>
    </section>
  );
};
