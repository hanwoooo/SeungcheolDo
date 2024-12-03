package com.example.subway.dto;

<<<<<<< HEAD
import com.example.subway.entity.MemberEntity;
=======
>>>>>>> 98fd4697b1b97f6c1cab97773c4812e2fc6ad1e2
import lombok.Data;

@Data
public class SignUpDto {

    private String memberName;
    private String memberEmail;
    private String memberPassword;
<<<<<<< HEAD

    public static SignUpDto toSignUpDto(MemberEntity memberEntity) {
        SignUpDto signUpDto = new SignUpDto();
        signUpDto.setMemberName(memberEntity.getMemberName());
        signUpDto.setMemberEmail(memberEntity.getMemberEmail());
        signUpDto.setMemberPassword(memberEntity.getMemberPassword());
        return signUpDto;
    }
=======
>>>>>>> 98fd4697b1b97f6c1cab97773c4812e2fc6ad1e2
}
