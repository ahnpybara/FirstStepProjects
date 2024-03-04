package dto;

public class AccountDTO {
	private String email;
	private String password;
	private String name;
	private String nickname;
	private String profile_image = "default_profile.jpg";
	
	public AccountDTO() {}
	
	// 로그인 관련 객체
	public AccountDTO(String email, String password) {
		super();
		this.email = email;
		this.password = password;
	}
	
	// 회원가입 관련 객체
	public AccountDTO(String email, String name, String nickname, String password) {
		super();
		this.email = email;
		this.password = password;
		this.name = name;
		this.nickname = nickname;
	}
	
	// 유저 관련 객체
	public AccountDTO(String email, String name, String nickname, String password, String profile_image) {
		super();
		this.email = email;
		this.password = password;
		this.name = name;
		this.nickname = nickname;
		this.profile_image = profile_image;
	}

	public String getEmail() {
		return email;
	}

	public void setEmail(String email) {
		this.email = email;
	}

	public String getPassword() {
		return password;
	}

	public void setPassword(String password) {
		this.password = password;
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

	public String getProfile_image() {
		return profile_image;
	}

	public void setProfile_image(String profile_image) {
		this.profile_image = profile_image;
	}
	
	
}
