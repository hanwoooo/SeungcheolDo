package com.example.subway.dto;

import com.example.subway.entity.MemberEntity;
import lombok.Data;

@Data
public class ProfileDto {

    private String memberName;
    private String memberEmail;
<<<<<<< HEAD
    private String memberImage = "/images/default-profile.png";
=======
    private String memberImage;
>>>>>>> 98fd4697b1b97f6c1cab97773c4812e2fc6ad1e2

    public static ProfileDto toProfileDto(MemberEntity memberEntity) {
        ProfileDto profileDtoDto = new ProfileDto();
        profileDtoDto.setMemberName(memberEntity.getMemberName());
        profileDtoDto.setMemberEmail(memberEntity.getMemberEmail());
<<<<<<< HEAD
=======
        profileDtoDto.setMemberImage("/images/default-profile.png");
>>>>>>> 98fd4697b1b97f6c1cab97773c4812e2fc6ad1e2
        return profileDtoDto;
    }
}