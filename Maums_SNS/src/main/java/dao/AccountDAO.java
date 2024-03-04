package dao;

import static common.JdbcTemplate.*;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;

import dto.AccountDTO;

public class AccountDAO {

	// 로그인을 위해 DB에 접근하는 로직
	public AccountDTO accountLogin(String email, String password) {
		Connection conn = getConnection();
		PreparedStatement pstmt = null;
		AccountDTO accountDto = null;
		ResultSet rs = null;

		try {
			String sql = "select * from users where email=? and password=?";
			pstmt = conn.prepareStatement(sql);
			pstmt.setString(1, email);
			pstmt.setString(2, password);
			rs = pstmt.executeQuery();
			
			// 나머지 세션 유저의 정보가 필요하므로 세션유저 객체에 나머지 데이터를 저장
			if (rs.next()) {
				accountDto = new AccountDTO();
				accountDto.setEmail(rs.getString("email"));
				accountDto.setPassword(rs.getString("password"));
				accountDto.setName(rs.getString("name"));
				accountDto.setNickname(rs.getString("nickname"));
				accountDto.setProfile_image(rs.getString("profile_image"));
			}
		} catch (SQLException e) {
			// TODO
			e.printStackTrace();
		} finally {
			close(conn);
			close(rs);
			close(pstmt);
		}
		return accountDto;
	}

	// 회원가입을 위해 데이터베이스에 접근하는 로직
	public boolean accountRegister(AccountDTO accountDto) {
		boolean isJoin = false;
		Connection conn = getConnection();
		PreparedStatement pstmt = null;

		try {
			String sql = "insert into users values(seq_user_num.NEXTVAL,?,?,?,?,?)";
			pstmt = conn.prepareStatement(sql);
			pstmt.setString(1, accountDto.getEmail());
			pstmt.setString(2, accountDto.getName());
			pstmt.setString(3, accountDto.getNickname());
			pstmt.setString(4, accountDto.getPassword());
			pstmt.setString(5, accountDto.getProfile_image());
			int n = pstmt.executeUpdate();

			if (n > 0) { // db에 데이터 추가를 성공한 경우
				isJoin = true;
				commit(conn);
			}
		} catch (SQLException e) {
			e.printStackTrace();
			rollback(conn);
		} finally {
			close(conn);
			close(pstmt);
		}
		return isJoin;
	}

	// 회원가입시 중복 체크하는 로직
	public String accountCheck(AccountDTO accountDto) {
		Connection conn = getConnection();
		PreparedStatement pstmt = null;
		ResultSet rs = null;
		// 회원가입 중복을 체크할 변수
		String duplicate_data = "non_duplicate";
		
		try {
			String sql = "select * from users where email=? or nickname=?";
			pstmt = conn.prepareStatement(sql);
			pstmt.setString(1, accountDto.getEmail());
			pstmt.setString(2, accountDto.getNickname());
			rs = pstmt.executeQuery();

			if (rs.next()) {
				// 중복체크할 변수
				String existingEmail = rs.getString("email");
				String existingNickname = rs.getString("nickname");
				// 중복 체크, 이메일 또는 닉네임이 중복이 되었는지 확인
				if (existingEmail.equals(accountDto.getEmail())) {
					duplicate_data = "email";
				} else if (existingNickname.equals(accountDto.getNickname())) {
					duplicate_data = "nickname";
				}
			}
		} catch (SQLException e) {
			e.printStackTrace();
		} finally {
			close(conn);
			close(rs);
			close(pstmt);
		}
		return duplicate_data;
	}
}