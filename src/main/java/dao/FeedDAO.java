package dao;

import static common.JdbcTemplate.close;
import static common.JdbcTemplate.commit;
import static common.JdbcTemplate.getConnection;
import static common.JdbcTemplate.rollback;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.SQLException;

import dto.AccountDTO;
import dto.FeedDTO;

public class FeedDAO {

	// 회원가입을 위해 DB에 접근하는 로직
	public boolean feedUploaded(FeedDTO feedDto) {
		boolean isUpload = false;
		Connection conn = getConnection();
		PreparedStatement pstmt = null;

		try {
			String sql = "insert into Feeds values(seq_feed_num.NEXTVAL,?,?,?)";
			pstmt = conn.prepareStatement(sql);
			pstmt.setString(1, feedDto.getEmail());
			pstmt.setString(2, feedDto.getFeed_image());
			pstmt.setString(3, feedDto.getFeed_content());
			int n = pstmt.executeUpdate();

			if (n > 0) { // db에 데이터 추가를 성공한 경우
				isUpload = true;
				commit(conn);
			}

		} catch (SQLException e) {
			e.printStackTrace();
			rollback(conn);
		} finally {
			close(conn);
			close(pstmt);
		}

		return isUpload;
	}

}
