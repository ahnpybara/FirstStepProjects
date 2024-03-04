package dto;

public class FeedListDTO {
	private int feed_id;
	private String email;
	private String feed_image;
	private String feed_content;
	private String name;
	private String nickname;
	
	public FeedListDTO() {
	}

	public FeedListDTO(int feed_id, String email, String feed_image, String feed_content, String name,
			String nickname) {
		super();
		this.feed_id = feed_id;
		this.email = email;
		this.feed_image = feed_image;
		this.feed_content = feed_content;
		this.name = name;
		this.nickname = nickname;
	}

	public int getFeed_id() {
		return feed_id;
	}

	public void setFeed_id(int feed_id) {
		this.feed_id = feed_id;
	}

	public String getEmail() {
		return email;
	}

	public void setEmail(String email) {
		this.email = email;
	}

	public String getFeed_image() {
		return feed_image;
	}

	public void setFeed_image(String feed_image) {
		this.feed_image = feed_image;
	}

	public String getFeed_content() {
		return feed_content;
	}

	public void setFeed_content(String feed_content) {
		this.feed_content = feed_content;
	}

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public String getNickname() {
		return nickname;
	}

	public void setNickname(String nickname) {
		this.nickname = nickname;
	}
	
	
}
