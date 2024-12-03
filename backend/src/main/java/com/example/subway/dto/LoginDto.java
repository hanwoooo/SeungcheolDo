package com.example.subway.dto;

<<<<<<< HEAD
import com.example.subway.entity.MemberEntity;
=======
>>>>>>> 98fd4697b1b97f6c1cab97773c4812e2fc6ad1e2
import lombok.*;

@Data
public class LoginDto {

    private String memberEmail;
    private String memberPassword;
<<<<<<< HEAD

    public static LoginDto toMemberDTO(MemberEntity memberEntity) {
        LoginDto loginDTO = new LoginDto();
        loginDTO.setMemberEmail(memberEntity.getMemberEmail());
        loginDTO.setMemberPassword(memberEntity.getMemberPassword());
        return loginDTO;
    }
=======
>>>>>>> 98fd4697b1b97f6c1cab97773c4812e2fc6ad1e2
}
