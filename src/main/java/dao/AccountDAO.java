package dao;

import static common.JdbcTemplate.*;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;

import dto.AccountDTO;

public class AccountDAO {

	// 로그인을 위해 DB에 접근하는 로직
	public boolean accountLogin(String email, String password) {
		boolean isLogin = false;
		Connection conn = getConnection();
		PreparedStatement pstmt = null;
		AccountDTO accountDto = new AccountDTO();
		ResultSet rs = null;

		try {
			String sql = "select * from users where email=? and password=?";
			pstmt = conn.prepareStatement(sql);
			pstmt.setString(1, email);
			pstmt.setString(2, password);
			rs = pstmt.executeQuery();

			if (rs.next()) {
				accountDto = new AccountDTO();
				accountDto.setEmail(rs.getString("email"));
				accountDto.setEmail(rs.getString("password"));
				isLogin = true;
			}
		} catch (SQLException e) {
			// TODO
			e.printStackTrace();
		} finally {
			close(conn);
			close(rs);
			close(pstmt);
		}
		return isLogin;
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
		String duplicate_data = null;
		
		try {
			String sql = "select * from users where email=? or nickname=?";
			pstmt = conn.prepareStatement(sql);
			pstmt.setString(1, accountDto.getEmail());
			pstmt.setString(2, accountDto.getNickname());
			rs = pstmt.executeQuery();
						
			if (rs.next()) {
				// 중복체크 로직
			    String existingEmail = rs.getString("email");
			    String existingNickname = rs.getString("nickname");
			    // 중복 체크
			    if (existingEmail.equals(accountDto.getEmail())) {
			    	duplicate_data = "email";
			    } else if (existingNickname.equals(accountDto.getNickname())) {
			    	duplicate_data = "nickname";
			    } else {
			    	duplicate_data = "non_duplicate";
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