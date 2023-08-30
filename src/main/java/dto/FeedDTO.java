package dto;

public class FeedDTO {
	private int feed_id = 0;
	private String email;
	private String feed_image;
	private String feed_content;
	
	public FeedDTO() {
	}

	public FeedDTO(String email, String feed_image, String feed_content) {
		super();
		this.email = email;
		this.feed_image = feed_image;
		this.feed_content = feed_content;
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
}
