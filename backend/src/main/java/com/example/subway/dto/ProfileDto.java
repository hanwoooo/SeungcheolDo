package com.example.subway.dto;

import com.example.subway.entity.MemberEntity;
import lombok.Data;

@Data
public class ProfileDto {

    private String memberName;
    private String memberEmail;
    private String memberImage = "/images/default-profile.png";

    public static ProfileDto toProfileDto(MemberEntity memberEntity) {
        ProfileDto profileDtoDto = new ProfileDto();
        profileDtoDto.setMemberName(memberEntity.getMemberName());
        profileDtoDto.setMemberEmail(memberEntity.getMemberEmail());
        return profileDtoDto;
    }
}